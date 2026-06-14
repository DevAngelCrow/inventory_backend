export abstract class CreateOrUpdateRefreshTokenPort {
  abstract createUpdate(
    id_user: string,
    refresh_token: string,
    expired_at: Date,
    device_info?: { ip_address?: string | null; user_agent?: string | null },
  ): Promise<void>;
}
