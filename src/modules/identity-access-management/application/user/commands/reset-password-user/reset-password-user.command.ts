export class ResetPasswordUserCommand {
  constructor(
    public readonly id: string,
    public readonly password: string,
    public readonly token: string,
  ) {}
}
