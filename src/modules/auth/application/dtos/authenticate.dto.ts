export class AuthenticateDto {
  constructor(
    public readonly user_name: string,
    public readonly id: string,
    public readonly token: string,
    public readonly refresh_token: string,
  ) {}
}
