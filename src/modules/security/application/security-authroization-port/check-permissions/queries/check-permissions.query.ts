export class CheckPermissionsQuery {
  constructor(
    public readonly permission: string,
    public readonly id_user: string,
  ) {}
}
