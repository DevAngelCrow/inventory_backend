import { randomUUID } from 'crypto';
import {
  AuthReadPort,
  SessionDto,
} from '@/modules/auth/application/ports/auth-read.port';
import { CreateOrUpdateRefreshTokenPort } from '@/modules/auth/domain/ports/create-or-update-refresh-token.port';
import { EmailSenderPort } from '@/modules/auth/domain/ports/email-sender.port';
import { UserAuthDto } from '@/modules/identity-access-management/application/dtos/user-auth.dto';
import { UserDto } from '@/modules/identity-access-management/application/dtos/user.dto';
import { PrismaService } from '@/shared/infrastructure/persistence/prisma/prisma.service';
import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { JwtPayload } from '../../strategies/jwt.strategy';
import { TransactionContextService } from '@/shared/infrastructure/services/transaction-context.service';
import { UserName } from '@/modules/identity-access-management/domain/value-objects/user-value-object/user-name';
import { PersonEmail } from '@/modules/profile/domain/value-objects/person-value-object/person-email';
import { JwtTokenHasher } from '../../services/jwt-token-hasher.service';
import { PasswordHasher } from '../../services/password-hasher.service';
import { JsonWebTokenError, JwtService, TokenExpiredError } from '@nestjs/jwt';
import { NotFoundException } from '@/shared/domain/exceptions/not-found.exception';
import { ConfigService } from '@nestjs/config';
import { StringValue } from 'ms';
import { Resend } from 'resend';
import * as fs from 'node:fs';
import * as path from 'node:path';

@Injectable()
export class ImplAuthPort
  implements AuthReadPort, CreateOrUpdateRefreshTokenPort, EmailSenderPort
{
  private readonly resend: Resend;
  constructor(
    private readonly prisma: PrismaService,
    private readonly transactionContext: TransactionContextService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {
    this.resend = new Resend(configService.get<string>('EMAIL_API_KEY'));
  }
  private getPrismaClient() {
    return this.transactionContext.getTransaction() ?? this.prisma;
  }
  async sendForgottenPasswordEmail(
    email: PersonEmail,
    user_name: UserName,
    verificationToken: { id: string; token: string },
  ): Promise<void> {
    try {
      const verificationUrl = `${this.configService.get<string>('CLIENT_URL')}${this.configService.get<string>('CLIENT_FORGOTTEN_PASSWORD')}?id=${verificationToken.id}&token=${verificationToken.token}`;
      const templatePath = path.join(
        __dirname,
        '..',
        '..',
        'views',
        'email-forgot-password.html',
      );
      const rawHtml = fs.readFileSync(templatePath, 'utf-8');
      // Reemplazar las variables del template
      const htmlTemplate = this.compileTemplate(rawHtml, {
        APP_URL: this.configService.get<string>('APP_URL') || '',
        RESET_PASSWORD_URL: verificationUrl,
        USER_NAME: user_name.value(),
      });
      await this.resend.emails.send({
        from: this.configService.get<string>('EMAIL_FROM')!,
        to: email.value(),
        subject: `Restablecer contraseña`,
        html: htmlTemplate,
      });
    } catch (error: unknown) {
      throw new Error(
        `Error sending forgotten password email: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }
  async sendVerificationEmail(
    email: PersonEmail,
    user_name: UserName,
    verificationToken: { id: string; token: string },
  ): Promise<void> {
    try {
      const verificationUrl = `${this.configService.get<string>('CLIENT_URL')}${this.configService.get<string>('CLIENT_VERIFY_EMAIL_ROUTE')}?url=${this.configService.get<string>('API_URL')}/auth/verify-email&id=${verificationToken.id}&token=${verificationToken.token}`;

      // Leer el template HTML
      const templatePath = path.join(
        __dirname,
        '..',
        '..',
        'views',
        'verify-email.html',
      );
      const rawHtml = fs.readFileSync(templatePath, 'utf-8');

      // Reemplazar las variables del template
      const htmlTemplate = this.compileTemplate(rawHtml, {
        APP_URL: this.configService.get<string>('APP_URL') || '',
        USER_NAME: user_name.value(),
        VERIFICATION_URL: verificationUrl,
      });
      await this.resend.emails.send({
        from: this.configService.get<string>('EMAIL_FROM')!,
        to: email.value(),
        subject: `Verifica tu cuenta`,
        html: htmlTemplate,
      });
    } catch (error: unknown) {
      throw new Error(
        `Error sending verification email: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }
  private static readonly MAX_SESSIONS = 5;

  async createUpdate(
    id_user: string,
    refresh_token: string,
    expired_at: Date,
    device_info?: { ip_address?: string | null; user_agent?: string | null },
  ): Promise<void> {
    try {
      const prisma = this.getPrismaClient();
      const hashedRefreshToken = await new JwtTokenHasher().hash(refresh_token);

      // Enforce max-sessions limit: delete the oldest sessions when over the cap.
      const sessionCount = await prisma.mnt_session_refresh_token.count({
        where: { id_user, revoked_at: null },
      });
      if (sessionCount >= ImplAuthPort.MAX_SESSIONS) {
        const oldest = await prisma.mnt_session_refresh_token.findMany({
          where: { id_user, revoked_at: null },
          orderBy: { created_at: 'asc' },
          take: sessionCount - ImplAuthPort.MAX_SESSIONS + 1,
          select: { id: true },
        });
        await prisma.mnt_session_refresh_token.deleteMany({
          where: { id: { in: oldest.map((s) => s.id) } },
        });
      }

      await prisma.mnt_session_refresh_token.create({
        data: {
          id_user,
          refresh_token_hashed: hashedRefreshToken,
          expired_at,
          ip_address: device_info?.ip_address ?? null,
          user_agent: device_info?.user_agent ?? null,
        },
      });
    } catch (error: unknown) {
      throw new Error(
        `Error creating or updating refresh token: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  async getLockoutStatus(
    userId: string,
  ): Promise<{ locked_until: Date | null; login_attempts: number }> {
    const user = await this.prisma.mnt_user.findFirst({
      where: { id: userId },
      select: { locked_until: true, login_attempts: true },
    });
    return {
      locked_until: user?.locked_until ?? null,
      login_attempts: user?.login_attempts ?? 0,
    };
  }

  async incrementLoginFailures(userId: string): Promise<void> {
    const MAX_ATTEMPTS =
      Number(this.configService.get<string>('AUTH_MAX_LOGIN_ATTEMPTS')) || 5;
    const LOCKOUT_MINUTES =
      Number(this.configService.get<string>('AUTH_LOCKOUT_MINUTES')) || 15;

    const updated = await this.prisma.mnt_user.update({
      where: { id: userId },
      data: { login_attempts: { increment: 1 } },
      select: { login_attempts: true },
    });

    if (updated.login_attempts >= MAX_ATTEMPTS) {
      const locked_until = new Date(Date.now() + LOCKOUT_MINUTES * 60_000);
      await this.prisma.mnt_user.update({
        where: { id: userId },
        data: { locked_until },
      });
    }
  }

  async resetLoginFailures(userId: string): Promise<void> {
    await this.prisma.mnt_user.update({
      where: { id: userId },
      data: { login_attempts: 0, locked_until: null },
    });
  }

  async getSessionsByUser(userId: string): Promise<SessionDto[]> {
    try {
      const prisma = this.getPrismaClient();
      const sessions = await prisma.mnt_session_refresh_token.findMany({
        where: {
          id_user: userId,
          revoked_at: null,
          expired_at: { gt: new Date() },
        },
        orderBy: { created_at: 'desc' },
        select: {
          id: true,
          created_at: true,
          last_used_at: true,
          expired_at: true,
          ip_address: true,
          user_agent: true,
          device_name: true,
        },
      });
      return sessions;
    } catch (error: unknown) {
      throw new Error(
        `Error fetching sessions: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  async revokeSession(sessionId: string, userId: string): Promise<void> {
    try {
      const prisma = this.getPrismaClient();
      const session = await prisma.mnt_session_refresh_token.findFirst({
        where: { id: sessionId, id_user: userId, revoked_at: null },
      });
      if (!session) {
        throw new NotFoundException('Session', sessionId);
      }
      await prisma.mnt_session_refresh_token.delete({
        where: { id: sessionId },
      });
    } catch (error: unknown) {
      if (error instanceof NotFoundException) throw error;
      throw new Error(
        `Error revoking session: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }
  async closeSession(token: { id: string }): Promise<void> {
    try {
      const prisma = this.getPrismaClient();
      const now = new Date();
      // Mark all active sessions as revoked (audit trail) then delete them
      await prisma.mnt_session_refresh_token.updateMany({
        where: { id_user: token.id, revoked_at: null },
        data: { revoked_at: now },
      });
      await prisma.mnt_session_refresh_token.deleteMany({
        where: { id_user: token.id },
      });
    } catch (error: unknown) {
      throw new Error(
        `Error closing session: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }
  async blacklistAccessToken(userId: string, tokenExp: number): Promise<void> {
    const ttlMs = Math.max(0, tokenExp * 1000 - Date.now());
    if (ttlMs > 0) {
      await this.cacheManager.set(
        `blacklist:user:${userId}`,
        Math.floor(Date.now() / 1000), // Store as seconds, matching JWT iat precision
        ttlMs,
      );
    }
  }
  async clearAccessTokenBlacklist(userId: string): Promise<void> {
    await this.cacheManager.del(`blacklist:user:${userId}`);
  }
  async validateCredentials(
    user_name: string,
    password: string,
    db_password: string,
  ): Promise<boolean> {
    const passwordHasher = new PasswordHasher();
    const isPasswordValid = await passwordHasher.compare(password, db_password);
    if (!isPasswordValid) {
      return false;
    }
    return isPasswordValid;
  }
  async decodeToken<JwtPayload>(
    token: string,
    isRefreshToken: boolean = false,
  ): Promise<JwtPayload> {
    try {
      const secret = this.configService.get<string>(
        isRefreshToken ? 'JWT_REFRESH_SECRET' : 'JWT_SECRET',
      )!;
      const rawToken = token.startsWith('Bearer ')
        ? token.split(' ')[1]
        : token;
      const payload = await this.jwtService.verifyAsync(rawToken, { secret });

      return payload as JwtPayload;
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new Error('El token ha expirado');
      }
      if (error instanceof JsonWebTokenError) {
        throw new Error('Token invalido');
      }
      throw new Error(`Failed to decode token: ${String(error)}`);
    }
  }
  async findRefreshTokenByIdUser(id_user: string): Promise<string> {
    try {
      const prisma = this.getPrismaClient();
      const refreshToken = await prisma.mnt_session_refresh_token.findFirst({
        where: { id_user: id_user },
        orderBy: { created_at: 'desc' },
      });
      if (!refreshToken) {
        throw new NotFoundException('Refresh token', id_user.toString());
      }
      return refreshToken.refresh_token_hashed;
    } catch (error: unknown) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(
        `Error retrieving refresh token: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }
  async hasVerifiedEmail(user: UserDto): Promise<boolean> {
    if (user.is_validated) {
      return Promise.resolve(true);
    }
    return Promise.resolve(false);
  }
  async generateToken(user: UserAuthDto): Promise<string> {
    const payload: JwtPayload = {
      user_name: user.user_name,
      id: user.id || '',
    };
    const jwtExpiresIn = this.configService.get<StringValue>('JWT_EXPIRES_IN');
    const jwtSecret = this.configService.get<StringValue>('JWT_SECRET');
    const token = await this.jwtService.signAsync(payload, {
      expiresIn: jwtExpiresIn,
      secret: jwtSecret,
    });
    return token;
  }
  async generateRefreshToken(user: UserAuthDto): Promise<string> {
    const payload: JwtPayload & { jti: string } = {
      user_name: user.user_name,
      id: user.id,
      jti: randomUUID(), // unique per token — prevents bcrypt/SHA-256 collisions when iat matches
    };
    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: this.configService.get<StringValue>('JWT_REFRESH_EXPIRES_IN'),
      secret: this.configService.get<StringValue>('JWT_REFRESH_SECRET')!,
    });
    return refreshToken;
  }
  async compareToken(token: string, token_hash: string): Promise<boolean> {
    const isMatch = await new JwtTokenHasher().compare(token, token_hash);
    return isMatch;
  }
  private escapeHtml(value: string): string {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;');
  }
  private compileTemplate(
    html: string,
    variables: Record<string, string>,
  ): string {
    const sanitize = (val: string | undefined) =>
      val?.replace(/['"]/g, '').trim() || '';
    const themeColors = {
      COLOR_PRIMARY: sanitize(
        this.configService.get<string>('EMAIL_COLOR_PRIMARY'),
      ),
      COLOR_SURFACE: sanitize(
        this.configService.get<string>('EMAIL_COLOR_SURFACE'),
      ),
      COLOR_CARD: sanitize(
        this.configService.get<string>('EMAIL_COLOR_BACKGROUND_CARD'),
      ),
      COLOR_TEXT: sanitize(
        this.configService.get<string>('EMAIL_COLOR_PRIMARY'),
      ),
      COLOR_TEXT_MUTED: sanitize(
        this.configService.get<string>('EMAIL_TEXT_MUTED'),
      ),
      COLOR_BORDER: sanitize(
        this.configService.get<string>('EMAIL_COLOR_PRIMARY'),
      ),
    };

    // Escape user-supplied values to prevent HTML injection in emails
    const escapedVariables: Record<string, string> = {};
    for (const [key, value] of Object.entries(variables)) {
      escapedVariables[key] = this.escapeHtml(value ?? '');
    }
    const allVariables = { ...themeColors, ...escapedVariables };

    return Object.entries(allVariables).reduce((acc, [key, value]) => {
      const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
      return acc.replaceAll(regex, value || '');
    }, html);
  }
}
