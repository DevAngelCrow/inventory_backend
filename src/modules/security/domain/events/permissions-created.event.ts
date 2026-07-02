export class PermissionsCreatedEvent {
  constructor(
    public readonly id: string | undefined,
    public readonly name: string,
    public readonly id_category_permissions: string,
    public readonly description: string,
    public readonly active: boolean,
  ) {}
}
