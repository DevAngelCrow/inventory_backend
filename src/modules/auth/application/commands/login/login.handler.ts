import { CreateOrUpdateRefreshTokenPort } from '@/modules/auth/domain/ports/create-or-update-refresh-token.port';
import { FindUserService } from '@/modules/identity-access-management/application/services/find-user.service';
import { LoginCommand } from './login.command';
import { AuthenticateDto } from '../../dtos/authenticate.dto';
import { UnauthorizedException } from '@/shared/application/exceptions/unauthorized.exception';
import { AuthReadPort } from '../../ports/auth-read.port';
import { UserAuthDto } from '@/modules/identity-access-management/application/dtos/user-auth.dto';
import { AuthCachePort } from '../../../domain/ports/auth-cache.port';
import { Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { authLoginTotal } from '@/shared/infrastructure/health/business-metrics';
import { ErrorCode } from '@/shared/domain/enums/error-code.enum';
import { AccountLockedException } from '@/shared/domain/exceptions/account-locked.exception';
import { AuditLogService } from '@/modules/audit/application/services/audit-log.service';
import { AuditAction } from '@/modules/audit/domain/enums/audit-action.enum';

const PERMISSIONS_CACHE_TTL_MS = 3_600_000;

@CommandHandler(LoginCommand)
export class LoginHandler implements ICommandHandler<LoginCommand> {
  private readonly logger = new Logger(LoginHandler.name);

  constructor(
    private readonly authReadPort: AuthReadPort,
    private readonly findUserService: FindUserService,
    private readonly createUpdateRefreshTokenPort: CreateOrUpdateRefreshTokenPort,
    private readonly authCachePort: AuthCachePort,
    private readonly auditLog: AuditLogService,
  ) {}
  async execute(command: LoginCommand): Promise<AuthenticateDto> {
    const userExists = await this.findUserService.run(command.user_name);
    const dummyPasswordHash =
      '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LkdRe4kLFCy'; // bcrypt hash for "password"
    if (!userExists) {
      //Dummy bcrypt
      await this.authReadPort.validateCredentials(
        command.user_name,
        command.password,
        dummyPasswordHash,
      );
      authLoginTotal.inc({ result: 'failure' });
      this.auditLog.log({
        action: AuditAction.LOGIN_FAILED,
        user_name: command.user_name,
        ip_address: command.ip_address,
        user_agent: command.user_agent,
      });
      throw new UnauthorizedException(
        'Invalid credentials',
        ErrorCode.AUTH_INVALID_CREDENTIALS,
      );
    }
    const userId = userExists.user.id;
    const userPassword = userExists.user.password;
    if (!userId || !userPassword) {
      this.auditLog.log({
        action: AuditAction.LOGIN_FAILED,
        user_name: command.user_name,
        ip_address: command.ip_address,
        user_agent: command.user_agent,
      });
      throw new UnauthorizedException(
        'Invalid credentials',
        ErrorCode.AUTH_INVALID_CREDENTIALS,
      );
    }

    // Check account lockout before validating credentials
    const lockout = await this.authReadPort.getLockoutStatus(userId);
    if (lockout.locked_until && lockout.locked_until > new Date()) {
      authLoginTotal.inc({ result: 'failure' });
      this.auditLog.log({
        action: AuditAction.LOGIN_FAILED,
        user_name: command.user_name,
        ip_address: command.ip_address,
        user_agent: command.user_agent,
      });
      throw new AccountLockedException(lockout.locked_until);
    }

    const credentialsValid = await this.authReadPort.validateCredentials(
      command.user_name,
      command.password,
      userPassword,
    );
    if (!credentialsValid) {
      authLoginTotal.inc({ result: 'failure' });
      await this.authReadPort.incrementLoginFailures(userId);
      this.auditLog.log({
        action: AuditAction.LOGIN_FAILED,
        user_name: command.user_name,
        ip_address: command.ip_address,
        user_agent: command.user_agent,
      });
      throw new UnauthorizedException(
        'Invalid credentials',
        ErrorCode.AUTH_INVALID_CREDENTIALS,
      );
    }
    const emailVerified = await this.authReadPort.hasVerifiedEmail(
      userExists.user,
    );
    if (!emailVerified) {
      authLoginTotal.inc({ result: 'failure' });
      this.auditLog.log({
        action: AuditAction.LOGIN_FAILED,
        user_name: command.user_name,
        ip_address: command.ip_address,
        user_agent: command.user_agent,
      });
      throw new UnauthorizedException(
        'Email not verified',
        ErrorCode.AUTH_EMAIL_NOT_VERIFIED,
      );
    }
    const userAuth = new UserAuthDto(
      userId,
      userExists.user.id_people,
      userExists.user.user_name,
      userExists.user.id_status,
      userExists.user.last_access,
      userExists.user.is_validated,
      userExists.permissions,
    );
    await this.authReadPort.clearAccessTokenBlacklist(userId);
    await this.authReadPort.resetLoginFailures(userId);
    const token = await this.authReadPort.generateToken(userAuth);
    const refreshToken = await this.authReadPort.generateRefreshToken(userAuth);
    const { exp } = await this.authReadPort.decodeToken<{ exp: number }>(
      refreshToken,
      true,
    );
    const authenticateDto = new AuthenticateDto(
      command.user_name,
      userId,
      token,
      refreshToken,
    );
    await this.createUpdateRefreshTokenPort.createUpdate(
      authenticateDto.id,
      refreshToken,
      new Date(exp * 1000),
      { ip_address: command.ip_address, user_agent: command.user_agent },
    );
    authLoginTotal.inc({ result: 'success' });
    this.auditLog.log({
      action: AuditAction.LOGIN_SUCCESS,
      user_name: command.user_name,
      user_id: userId,
      ip_address: command.ip_address,
      user_agent: command.user_agent,
    });
    try {
      await this.authCachePort.cacheUserPermissions(
        userId,
        userExists.permissions,
        PERMISSIONS_CACHE_TTL_MS,
      );
    } catch (error) {
      this.logger.warn(
        `Unable to warm permissions cache for user ${userId}: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
    return authenticateDto;
  }
}
