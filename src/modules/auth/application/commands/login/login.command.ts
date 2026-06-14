export class LoginCommand {
  constructor(
    public readonly user_name: string,
    public readonly password: string,
    public readonly ip_address?: string | null,
    public readonly user_agent?: string | null,
  ) {}
}
