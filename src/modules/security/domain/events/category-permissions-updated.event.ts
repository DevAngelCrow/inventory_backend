export class CategoryPermissionsUpdatedEvent {
  constructor(
    public readonly name: string,
    public readonly description: string,
  ) {}
}
