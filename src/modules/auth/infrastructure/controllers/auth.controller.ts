/// <reference types="multer" />
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { RegisterValidatorDto } from '../dtos/validators/auth/register.dto';
import { UpdateProfileBodyDto } from '../dtos/validators/auth/update-profile-body.dto';
import { DocsAccessDto } from '../dtos/validators/auth/docs-access.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express, Request } from 'express';
import {
  multerImageOptions,
  validateFileMagicBytes,
} from '@/modules/storage/infrastructure/config/multer-file-filter.config';
import { SuccessResponseDto } from '@/shared/infrastructure/http/dtos/http-success-response.dto';
type MulterFile = Express.Multer.File;
import { RegisterDto } from '../../application/dtos/register.dto';
import { Transactional } from '@/shared/infrastructure/decorators/transactional.decorator';
import { LoginDto } from '../dtos/validators/auth/login.dto';
import { AuthLoginHttpDto } from '../dtos/http/user-http-dto/auth-login-http.dto';
import { SkipAuth } from '../decorators/public-route.decorator';
import {
  ApiBody,
  ApiConsumes,
  ApiExcludeEndpoint,
  ApiResponse,
  ApiBearerAuth,
  ApiOperation,
} from '@nestjs/swagger';
import { Response as ExpressResponse } from 'express';
import { JwtService } from '@nestjs/jwt';
import { UserReadRepository } from '@/modules/identity-access-management/application/repositories/user-read.repository';
import { ForbiddenException } from '@/shared/application/exceptions/forbidden.exception';
import { NotFoundException } from '@/shared/domain/exceptions/not-found.exception';
import { JwtPayload } from '../strategies/jwt.strategy';

import { JwtRefreshGuard } from '../guards/jwt-refresh.guard';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetAddressByIdQuery } from '@/modules/profile/application/address/queries/get-address-by-id/get-address-by-id.query';
import { GetDocumentByIdQuery } from '@/modules/profile/application/document/queries/get-document-by-id/get-document-by-id.query';
import { Address } from '@/modules/profile/domain/entities/address';
import { Document } from '@/modules/profile/domain/entities/document';
import { RegisterCommand } from '../../application/commands/register/register.command';
import { LoginCommand } from '../../application/commands/login/login.command';
import { VerifyEmailCommand } from '../../application/commands/email-verification/verify-email.command';
import { LogoutCommand } from '../../application/commands/logout/logout.command';
import { RevokeAllSessionsCommand } from '../../application/commands/revoke-all-sessions/revoke-all-sessions.command';
import { RevokeSessionCommand } from '../../application/commands/revoke-session/revoke-session.command';
import { GetSessionsQuery } from '../../application/queries/get-sessions/get-sessions.query';
import { SessionDto } from '../../application/ports/auth-read.port';
import { RefreshCommand } from '../../application/commands/refresh/refresh.command';
import { UpdateProfileDto } from '../../application/dtos/update-profile.dto';
import { UpdateProfileCommand } from '../../application/commands/update-profile/update-profile.command';
import { ResetPasswordDto } from '../dtos/validators/auth/reset-password.dto';
import { EmailForgotPasswordDto } from '../dtos/validators/auth/email-forgot-password.dto';
import { GenerateTokenForgottenPasswordCommand } from '../../application/commands/generate-token-forgotten-password/generate-token-forgotten-password.command';
import { ResetForgottenPasswordCommand } from '../../application/commands/reset-forgotten-password/reset-forgotten-password.command';
import { Permissions } from '@/modules/security/infrastructure/decorators/permissions.decorator';
import { CheckAuthenticatedUserGuard } from '../guards/check-authenticated-user.guard';
import { CheckAuthenticatedUser } from '../decorators/check-authenticated-user.decorator';
import { Throttle } from '@nestjs/throttler';
import { ConfigService } from '@nestjs/config';
import { VerifyEmailQueryDto } from '../dtos/validators/auth/verify-email-query.dto';

import { AuditLogService } from '@/modules/audit/application/services/audit-log.service';
import { AuditAction } from '@/modules/audit/domain/enums/audit-action.enum';
import { Auditable } from '@/modules/audit/infrastructure/decorators/auditable.decorator';

@Controller('/')
export class AuthController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly config: ConfigService,
    private readonly jwtService: JwtService,
    private readonly userReadRepository: UserReadRepository,
    private readonly auditLog: AuditLogService,
  ) {}

  private getClientIp(req: Request): string | null {
    const rawHeader = (
      req as unknown as {
        headers?: Record<string, string | string[] | undefined>;
      }
    ).headers?.['x-forwarded-for'];
    const forwarded = Array.isArray(rawHeader) ? rawHeader[0] : rawHeader;
    if (forwarded) {
      return forwarded.split(',')[0]?.trim() ?? null;
    }
    return (
      (req as unknown as { socket?: { remoteAddress?: string } }).socket
        ?.remoteAddress ?? null
    );
  }

  private getUserAgent(req: Request): string | null {
    return (
      (req as unknown as Record<string, Record<string, string>>).headers?.[
        'user-agent'
      ] ?? null
    );
  }
  @SkipAuth()
  @Throttle({ global: { ttl: 3_600_000, limit: 5 } })
  @Auditable({
    action: AuditAction.REGISTER,
    entityType: 'User',
    entityIdFrom: 'body.email',
  })
  @Post('sign-up')
  @HttpCode(201)
  @ApiOperation({ summary: 'Register a new user account' })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 409, description: 'Email already registered' })
  @ApiResponse({ status: 429, description: 'Too many requests' })
  @UseInterceptors(FileInterceptor('file_img', multerImageOptions))
  @Transactional()
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: RegisterValidatorDto })
  async create(
    @Body() request: RegisterValidatorDto,
  ): Promise<SuccessResponseDto<null>> {
    const registerDto = new RegisterDto(
      request.first_name ?? '',
      request.middle_name ?? '',
      request.last_name ?? '',
      request.birthdate ?? null,
      request.email,
      request.id_gender ?? null,
      request.id_marital_status ?? null,
      request.phone ?? null,
      //1 /*id_status*/,
      request.nationalities ?? [],
      null,
      undefined,
      //User data
      request.email,
      request.password,
      //1 /*id status user*/,
      new Date() /*last access*/,
      false,
      undefined,
      //Address data
      /*request.street*/ '',
      /*request.street_number*/ '',
      /*request.neighborhood*/ '',
      /*request.id_geographic_division*/ '',
      /*request.house_number*/ '',
      /*request.block*/ '',
      /*request.pathway*/ '',
      /*request.current*/ null,
      undefined,
      null,
      //Document data
      /*request.id_type_document*/ null,
      /*request.description*/ null,
      /*request.document_number*/ null,
      /*request.active*/ null,
      undefined,
    );
    const registerCommand = new RegisterCommand(registerDto);
    await this.commandBus.execute(registerCommand);
    return new SuccessResponseDto<null>(
      null,
      HttpStatus.CREATED,
      'User created successfully',
    );
  }
  @SkipAuth()
  @Throttle({ global: { ttl: 60000, limit: 5 } })
  @Post('login')
  @HttpCode(200)
  @ApiOperation({ summary: 'Authenticate and receive JWT tokens' })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    type: AuthLoginHttpDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials or email not verified',
  })
  @ApiResponse({ status: 429, description: 'Too many login attempts' })
  async login(
    @Body() request: LoginDto,
    @Req() req: Request,
  ): Promise<SuccessResponseDto<AuthLoginHttpDto>> {
    const ip = this.getClientIp(req);
    const ua = this.getUserAgent(req);
    try {
      const loginCommand = new LoginCommand(
        request.user_name,
        request.password,
        ip,
        ua,
      );
      const authLogin = await this.commandBus.execute<
        LoginCommand,
        { id: string; user_name: string; token: string; refresh_token: string }
      >(loginCommand);
      this.auditLog.log({
        action: AuditAction.LOGIN_SUCCESS,
        user_name: request.user_name,
        user_id: authLogin.id,
        ip_address: ip,
        user_agent: ua,
      });
      const authLoginHttpDto: AuthLoginHttpDto = new AuthLoginHttpDto(
        authLogin.user_name,
        authLogin.id,
        authLogin.token,
        'Bearer',
        authLogin.user_name,
        authLogin.refresh_token,
      );
      return new SuccessResponseDto<AuthLoginHttpDto>(
        authLoginHttpDto,
        HttpStatus.OK,
        'Successfully logged in',
      );
    } catch (err) {
      this.auditLog.log({
        action: AuditAction.LOGIN_FAILED,
        user_name: request.user_name,
        ip_address: ip,
        user_agent: ua,
      });
      throw err;
    }
  }
  @SkipAuth()
  @Throttle({ global: { ttl: 3_600_000, limit: 10 } })
  @Get('verify-email')
  @ApiOperation({ summary: 'Verify user email with token' })
  @ApiResponse({ status: 200, description: 'Email verified successfully' })
  @ApiResponse({ status: 400, description: 'Invalid or expired token' })
  async verifyEmail(
    @Query() query: VerifyEmailQueryDto,
  ): Promise<SuccessResponseDto<null>> {
    const verifyEmailCommand = new VerifyEmailCommand(query.id, query.token);
    await this.commandBus.execute(verifyEmailCommand);
    return new SuccessResponseDto<null>(
      null,
      HttpStatus.OK,
      'Email verified successfully',
    );
  }
  @Permissions('cerrar-sesion')
  @Throttle({ global: { ttl: 60000, limit: 5 } })
  @Post('logout')
  @HttpCode(200)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Logout and invalidate the current access token' })
  @ApiResponse({ status: 200, description: 'Logged out successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async logout(
    @Req() request: Request<{ headers: { authorization: string } }>,
  ): Promise<SuccessResponseDto<null>> {
    const token = request.headers.authorization?.replace('Bearer ', '') || '';
    const logoutCommand = new LogoutCommand(token);
    await this.commandBus.execute(logoutCommand);
    const user = (
      request as unknown as { user?: { id?: string; user_name?: string } }
    ).user;
    this.auditLog.log({
      action: AuditAction.LOGOUT,
      user_name: user?.user_name ?? null,
      user_id: user?.id ?? null,
      ip_address: this.getClientIp(request as unknown as Request),
      user_agent: this.getUserAgent(request as unknown as Request),
    });
    return new SuccessResponseDto<null>(
      null,
      HttpStatus.OK,
      'Successfully logged out',
    );
  }
  @Permissions('cerrar-sesion')
  @Throttle({ global: { ttl: 60000, limit: 5 } })
  @Delete('sessions')
  @HttpCode(200)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Revoke all active sessions for the current user' })
  @ApiResponse({ status: 200, description: 'All sessions revoked' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async revokeAllSessions(
    @Req() request: Request<{ headers: { authorization: string } }>,
  ): Promise<SuccessResponseDto<null>> {
    const token = request.headers.authorization?.replace('Bearer ', '') || '';
    const userId = (
      request as unknown as { user: { id: string; user_name?: string } }
    ).user.id;
    const revokeCommand = new RevokeAllSessionsCommand(userId, token);
    await this.commandBus.execute(revokeCommand);
    const user = (
      request as unknown as { user?: { id?: string; user_name?: string } }
    ).user;
    this.auditLog.log({
      action: AuditAction.REVOKE_ALL_SESSIONS,
      user_name: user?.user_name ?? null,
      user_id: userId,
      ip_address: this.getClientIp(request as unknown as Request),
      user_agent: this.getUserAgent(request as unknown as Request),
    });
    return new SuccessResponseDto<null>(
      null,
      HttpStatus.OK,
      'All sessions revoked successfully',
    );
  }
  @SkipAuth()
  @UseGuards(JwtRefreshGuard)
  @Post('refresh-token')
  @HttpCode(200)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Obtain a new access token using a refresh token' })
  @ApiResponse({
    status: 200,
    description: 'Tokens refreshed',
    type: AuthLoginHttpDto,
  })
  @ApiResponse({ status: 401, description: 'Invalid or expired refresh token' })
  async refreshToken(
    @Req() request: Request<{ headers: { authorization: string } }>,
  ): Promise<SuccessResponseDto<AuthLoginHttpDto>> {
    const token = request.headers.authorization?.replace('Bearer ', '') || '';
    const refreshTokenCommand = new RefreshCommand(token);
    const tokens = await this.commandBus.execute<
      RefreshCommand,
      { id: string; user_name: string; token: string; refresh_token: string }
    >(refreshTokenCommand);

    const authLoginHttpDto = new AuthLoginHttpDto(
      tokens.user_name,
      tokens.id,
      tokens.token,
      'Bearer',
      tokens.user_name,
      tokens.refresh_token,
    );
    this.auditLog.log({
      action: AuditAction.TOKEN_REFRESH,
      user_name: tokens.user_name,
      user_id: tokens.id,
    });
    return new SuccessResponseDto<AuthLoginHttpDto>(
      authLoginHttpDto,
      HttpStatus.OK,
      'Successfully refreshed session',
    );
  }
  @Permissions('editar-mi-perfil')
  @UseGuards(CheckAuthenticatedUserGuard)
  @CheckAuthenticatedUser('id')
  @Put('update-profile/:id')
  @HttpCode(200)
  @UseInterceptors(FileInterceptor('file_img', multerImageOptions))
  @Transactional()
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdateProfileBodyDto })
  async updateProfile(
    @Param('id') id: string,
    @Body() request: UpdateProfileBodyDto,
    @UploadedFile() file?: MulterFile,
  ): Promise<SuccessResponseDto<null>> {
    if (file?.buffer && !validateFileMagicBytes(file.buffer, file.mimetype)) {
      throw new BadRequestException(
        `File content does not match its declared MIME type '${file.mimetype}'`,
      );
    }

    // Resolve id_people and current id_status / is_validated SERVER-SIDE from
    // the authenticated user. Never accept these from the body — doing so
    // would allow IDOR (modifying another person's record) and mass-assignment
    // (self-validating email, self-promoting status).
    const user = await this.userReadRepository.getOneById(id);
    if (!user) {
      throw new NotFoundException('User', id);
    }
    const idPeople = user.id_people;

    // If the request targets an address/document, verify it belongs to this
    // user before forwarding to the update handler. Prevents IDOR via
    // body-supplied id_address / id_document.
    if (request.id_address) {
      const address = await this.queryBus.execute<
        GetAddressByIdQuery,
        Address | null
      >(new GetAddressByIdQuery(request.id_address));
      if (!address) {
        throw new NotFoundException('Address', request.id_address);
      }
      if (address.getIdPeople().value() !== idPeople) {
        throw new ForbiddenException(
          'You are not allowed to modify this address.',
        );
      }
    }
    if (request.id_document) {
      const document = await this.queryBus.execute<
        GetDocumentByIdQuery,
        Document | null
      >(new GetDocumentByIdQuery(request.id_document));
      if (!document) {
        throw new NotFoundException('Document', request.id_document);
      }
      if (document.getIdPeople().value() !== idPeople) {
        throw new ForbiddenException(
          'You are not allowed to modify this document.',
        );
      }
    }

    const updateProfileDto = new UpdateProfileDto(
      request.first_name ?? null,
      request.middle_name ?? null,
      request.last_name ?? null,
      request.birthdate ? new Date(request.birthdate) : null,
      request.email ?? '',
      request.id_gender ?? null,
      request.id_marital_status ?? null,
      request.phone ?? null,
      // id_status: preserved from the user's current record (admin-only field)
      user.id_status,
      // img_path: only set via the validated file upload — never from the body
      null,
      request.nationalities,
      file ?? null,
      // id_people: derived from the authenticated user — never from the body
      idPeople,
      request.user_name ?? '',
      // password: handled by the dedicated password-change endpoint
      '',
      // last_access: server-side timestamp, not editable by the user
      new Date(),
      // is_validated: governed by the email-verification flow only
      user.is_validated,
      id,
      request.street ?? null,
      request.street_number ?? null,
      request.neighborhood ?? null,
      request.id_geographic_division ?? null,
      request.house_number ?? null,
      request.block ?? null,
      request.pathway ?? null,
      request.current === undefined
        ? null
        : request.current === 'true' || request.current === true,
      request.id_address ?? '',
      // active_address: admin-only soft-delete toggle
      null,
      request.id_type_document ?? '',
      request.description ?? null,
      request.document_number ?? null,
      // active (document): admin-only soft-delete toggle
      null,
      request.id_document ?? '',
    );

    const updateProfileCommand = new UpdateProfileCommand(
      updateProfileDto,
      'LOCAL',
    );
    await this.commandBus.execute(updateProfileCommand);

    return new SuccessResponseDto<null>(
      null,
      HttpStatus.OK,
      'Profile updated successfully',
    );
  }
  @SkipAuth()
  @ApiExcludeEndpoint()
  @Throttle({ global: { ttl: 60000, limit: 10 } })
  @Post('docs-access')
  @HttpCode(HttpStatus.OK)
  async docsAccess(
    @Body() body: DocsAccessDto,
    @Res({ passthrough: true }) res: ExpressResponse,
  ): Promise<SuccessResponseDto<null>> {
    let payload: JwtPayload;
    try {
      payload = this.jwtService.verify<JwtPayload>(body.access_token);
    } catch {
      throw new ForbiddenException('Token inválido o expirado');
    }

    const user = await this.userReadRepository.getOneByIdForAuth(payload.id);
    if (!user || !user.permissions.includes('ver-documentacion-api')) {
      throw new ForbiddenException(
        'No posee permiso para acceder a la documentación de la API',
      );
    }

    const cookieToken = this.jwtService.sign({
      id: payload.id,
      user_name: payload.user_name,
    });
    const decoded = this.jwtService.decode<{ exp?: number }>(cookieToken);
    const maxAge = decoded?.exp
      ? (decoded.exp - Math.floor(Date.now() / 1000)) * 1000
      : 3_600_000;

    const isProduction =
      this.config.get<string>('NODE_ENV')?.trim() !== 'development';

    res.cookie('docs_access', cookieToken, {
      httpOnly: true,
      sameSite: 'strict',
      secure: isProduction,
      path: '/',
      maxAge,
    });

    this.auditLog.log({
      action: AuditAction.DOCS_ACCESS_GRANTED,
      user_name: payload.user_name,
      user_id: payload.id,
    });

    return new SuccessResponseDto<null>(
      null,
      HttpStatus.OK,
      'Docs access granted',
    );
  }

  @SkipAuth()
  @ApiExcludeEndpoint()
  @Get('docs-logout')
  @HttpCode(HttpStatus.OK)
  docsLogout(
    @Res({ passthrough: true }) res: ExpressResponse,
  ): SuccessResponseDto<null> {
    const isProduction =
      this.config.get<string>('NODE_ENV')?.trim() !== 'development';
    res.clearCookie('docs_access', {
      httpOnly: true,
      sameSite: 'strict',
      secure: isProduction,
      path: '/',
    });
    return new SuccessResponseDto<null>(
      null,
      HttpStatus.OK,
      'Docs session closed',
    );
  }

  @SkipAuth()
  @Throttle({ global: { ttl: 3_600_000, limit: 3 } })
  @Post('forgot-password')
  @HttpCode(200)
  @ApiOperation({ summary: 'Request a password reset email' })
  @ApiResponse({
    status: 200,
    description: 'Reset email sent if address is registered',
  })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 429, description: 'Too many requests' })
  async generateTokenForForgottenPassword(
    @Body() request: EmailForgotPasswordDto,
    @Req() req: Request,
  ): Promise<SuccessResponseDto<null>> {
    const generateTokenForForgottenPasswordCommand =
      new GenerateTokenForgottenPasswordCommand(request.email);
    await this.commandBus.execute(generateTokenForForgottenPasswordCommand);
    this.auditLog.log({
      action: AuditAction.PASSWORD_RESET_REQUESTED,
      ip_address: this.getClientIp(req),
      user_agent: this.getUserAgent(req),
      metadata: { email: request.email },
    });
    return new SuccessResponseDto<null>(
      null,
      HttpStatus.OK,
      'If your email is registered, you will receive a link in the next few minutes.',
    );
  }
  @SkipAuth()
  @Throttle({ global: { ttl: 3_600_000, limit: 10 } })
  @Put('reset-password')
  @HttpCode(200)
  @ApiOperation({ summary: 'Complete password reset with token' })
  @ApiResponse({ status: 200, description: 'Password reset successfully' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 404, description: 'Token not found or expired' })
  async resetPassword(
    @Body() request: ResetPasswordDto,
    @Req() req: Request,
  ): Promise<SuccessResponseDto<null>> {
    const ip = this.getClientIp(req);
    const ua = this.getUserAgent(req);
    const resetPasswordCommand = new ResetForgottenPasswordCommand(
      request.token,
      request.password,
      request.id,
    );
    // The handler returns the real user_id resolved from the token — request.id
    // holds the TOKEN id, not the user id, so auditing it directly would store
    // useless data.
    const { user_id } = await this.commandBus.execute<
      ResetForgottenPasswordCommand,
      { user_id: string }
    >(resetPasswordCommand);
    this.auditLog.log({
      action: AuditAction.PASSWORD_RESET_COMPLETED,
      user_id,
      ip_address: ip,
      user_agent: ua,
      // Stamp the token id and the IP/UA explicitly so security can correlate
      // this consumption against the PASSWORD_RESET_REQUESTED entry that was
      // logged when the user originally asked for the email.
      metadata: {
        token_id: request.id,
        consumed_ip: ip,
        consumed_user_agent: ua,
      },
    });
    return new SuccessResponseDto<null>(
      null,
      HttpStatus.OK,
      'Password reset successfully',
    );
  }

  @Get('sessions')
  @HttpCode(200)
  @ApiOperation({ summary: 'List active sessions for the authenticated user' })
  @ApiResponse({ status: 200, description: 'Sessions listed successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getSessions(
    @Req() req: Request,
  ): Promise<SuccessResponseDto<SessionDto[]>> {
    const payload = req.user as JwtPayload;
    const sessions: SessionDto[] = await this.queryBus.execute(
      new GetSessionsQuery(payload.id),
    );
    return new SuccessResponseDto<SessionDto[]>(
      sessions,
      HttpStatus.OK,
      'Sessions retrieved successfully',
    );
  }

  @Delete('sessions/:id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Revoke a specific session by ID' })
  @ApiResponse({ status: 200, description: 'Session revoked successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Session not found' })
  async revokeSession(
    @Param('id', ParseUUIDPipe) sessionId: string,
    @Req() req: Request,
  ): Promise<SuccessResponseDto<null>> {
    const payload = req.user as JwtPayload;
    await this.commandBus.execute(
      new RevokeSessionCommand(sessionId, payload.id),
    );
    return new SuccessResponseDto<null>(
      null,
      HttpStatus.OK,
      'Session revoked successfully',
    );
  }
}
