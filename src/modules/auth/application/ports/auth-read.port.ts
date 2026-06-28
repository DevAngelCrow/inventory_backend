import { UserAuthDto } from '@/modules/identity-access-management/application/dtos/user-auth.dto';
import { UserDto } from '@/modules/identity-access-management/application/dtos/user.dto';

export interface SessionDto {
  id: string;
  created_at: Date;
  last_used_at: Date | null;
  expired_at: Date;
  ip_address: string | null;
  user_agent: string | null;
  device_name: string | null;
}

export abstract class AuthReadPort {
  abstract closeSession(token: { id: string }): Promise<void>;
  abstract validateCredentials(
    user_name: string,
    password: string,
    db_password: string,
  ): Promise<boolean>;
  abstract decodeToken<T>(token: string, isRefreshToken: boolean): Promise<T>;
  abstract findRefreshTokenByIdUser(id_user: string): Promise<string>;
  abstract hasVerifiedEmail(user: UserDto): Promise<boolean>;
  abstract generateToken(user: UserAuthDto): Promise<string>;
  abstract generateRefreshToken(user: UserAuthDto): Promise<string>;
  abstract verifyToken<T extends object>(token: string): Promise<T>;
  abstract signPayload(payload: any): string;
  abstract compareToken(token: string, token_hash: string): Promise<boolean>;
  abstract blacklistAccessToken(
    userId: string,
    tokenExp: number,
  ): Promise<void>;
  abstract clearAccessTokenBlacklist(userId: string): Promise<void>;
  abstract getSessionsByUser(userId: string): Promise<SessionDto[]>;
  abstract revokeSession(sessionId: string, userId: string): Promise<void>;
  abstract incrementLoginFailures(userId: string): Promise<void>;
  abstract resetLoginFailures(userId: string): Promise<void>;
  abstract getLockoutStatus(
    userId: string,
  ): Promise<{ locked_until: Date | null; login_attempts: number }>;
}
