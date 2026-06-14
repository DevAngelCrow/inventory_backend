import { UserRoleAggregate } from '../../domain/aggregates/user-role.aggregate';

export class UserRolDto {
  constructor(
    public readonly user_id: string,
    public readonly role_id: string[],
    public readonly id?: string,
  ) {}
  public static fromAggregate(user_rol: UserRoleAggregate): UserRolDto {
    return new UserRolDto(
      user_rol.getIdUser().value(),
      user_rol.getIdRole().map((role) => role.value()),
      user_rol.getId() ? user_rol.getId()?.value() : undefined,
    );
  }
}
