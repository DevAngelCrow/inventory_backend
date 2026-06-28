export class PermissionsUpdatedEvent {
  constructor(
    public readonly name: string,
    public readonly description: string,
    public readonly id_category_permissions: string,
  ) {}
}
