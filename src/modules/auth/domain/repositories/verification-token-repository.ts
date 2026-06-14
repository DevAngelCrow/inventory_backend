import { UserId } from '../../../identity-access-management/domain/value-objects/user-value-object/user-id';

export abstract class VerificationTokenRepository {
  abstract create(user_id: UserId): Promise<{ token: string; id: string }>;
  abstract findByToken(
    id: string,
    token: string,
  ): Promise<{ user_id: UserId; expires_at: Date; id: string } | null>;
  abstract deleteByUserId(
    user_id: UserId,
    is_reset_password?: boolean,
  ): Promise<void>;
  abstract createTokenForForgottenPassword(
    user_id: UserId,
  ): Promise<{ token: string; id: string }>;
  abstract markAsUsed(id_token: string): Promise<void>;
}
