export class LoginDto {
  constructor(
    public readonly user_name: string,
    public readonly password: string,
  ) {}
}
