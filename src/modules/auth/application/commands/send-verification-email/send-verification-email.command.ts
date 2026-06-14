export class SendVerificationEmailCommand {
  constructor(
    public readonly user_id: string,
    public readonly email: string,
    public readonly user_name: string,
  ) {}
}
