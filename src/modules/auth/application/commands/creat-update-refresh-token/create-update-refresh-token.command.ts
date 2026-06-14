export class CreateUpdateRefreshTokenCommand {
  constructor(
    public id_user: string,
    public refresh_token: string,
    public expired_at: Date,
  ) {}
}
