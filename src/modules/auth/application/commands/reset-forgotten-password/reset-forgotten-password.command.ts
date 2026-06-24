export class ResetForgottenPasswordCommand {
  constructor(
    public readonly token: string,
    public readonly password: string,
    public readonly id: string,
    public readonly ip_address: string | null,
    public readonly user_agent: string | null,
  ) {}
}
