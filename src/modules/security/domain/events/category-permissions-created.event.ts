export class CategoryPermissionsCreatedEvent {
  constructor(
    public readonly id: string | undefined,
    public readonly name: string,
    public readonly description: string,
    public readonly active: boolean,
  ) {}
}
