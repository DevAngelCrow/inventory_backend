export class UserRolExtendedDto<R = unknown> {
  constructor(
    public readonly user_name: string,
    public readonly email: string,
    public readonly is_validated: boolean,
    public readonly id_status: string,
    public readonly id?: string,
    public readonly role?: R[],
  ) {}

  static fromDto<R>(dto: UserRolExtendedDto<R>): UserRolExtendedDto<R> {
    return new UserRolExtendedDto<R>(
      dto.user_name,
      dto.email,
      dto.is_validated,
      dto.id_status,
      dto.id,
      dto.role,
    );
  }
}
