export class UserEmailVerifiedEvent {
  constructor(
    public readonly id: string,
    public readonly activeStatusId: string,
  ) {}
}
