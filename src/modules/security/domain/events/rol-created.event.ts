export class RolCreatedEvent {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly description: string,
    public readonly code: string,
    public readonly statusId: string,
    public readonly permissions: string[] | undefined,
  ) {}
}
