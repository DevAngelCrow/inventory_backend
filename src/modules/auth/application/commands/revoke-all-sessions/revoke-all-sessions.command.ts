export class RevokeAllSessionsCommand {
  constructor(
    public readonly userId: string,
    public readonly currentAccessToken: string,
  ) {}
}
