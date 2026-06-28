export class UserRoleCreatedEvent {
  constructor(
    public readonly id: string | undefined,
    public readonly userId: string,
    public readonly roleIds: string[],
  ) {}
}
