export class HasRoleQuery {
  constructor(
    public readonly role: string[],
    public readonly id_user: string,
  ) {}
}
