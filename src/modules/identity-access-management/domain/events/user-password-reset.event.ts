export class UserPasswordResetEvent {
  constructor(
    public readonly userId: string,
  ) {}
}
