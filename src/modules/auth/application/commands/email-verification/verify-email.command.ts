export class VerifyEmailCommand {
  constructor(
    public readonly id: string,
    public readonly token: string,
  ) {}
}
