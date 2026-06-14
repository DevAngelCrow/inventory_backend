export class AuthLoginHttpDto {
  constructor(
    public readonly user_name: string,
    public readonly id: string,
    public readonly access_token: string,
    public readonly token_type: string = 'Bearer',
    public readonly user: string,
    public readonly refresh_token: string,
  ) {}
}
