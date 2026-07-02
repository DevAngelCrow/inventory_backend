export class UserNameUpdatedEvent {
  constructor(
    public readonly userId: string,
    public readonly newName: string,
  ) {}
}
