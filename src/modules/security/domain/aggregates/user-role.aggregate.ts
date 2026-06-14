import { UserRoleId } from '../value-objects/user-role-value-object/user-role-id';
import { UserRoleIdUser } from '../value-objects/user-role-value-object/user-role-id-user';
import { UserRoleIdRol } from '../value-objects/user-role-value-object/user-role-id-rol';

export class UserRoleAggregate {
  constructor(
    private readonly id_user: UserRoleIdUser,
    private readonly role: UserRoleIdRol[],
    private readonly id?: UserRoleId,
  ) {}
  getId(): UserRoleId | undefined {
    return this.id;
  }
  getIdUser(): UserRoleIdUser {
    return this.id_user;
  }
  getIdRole(): UserRoleIdRol[] {
    return this.role;
  }
  public static create(data: {
    id?: string;
    user_id: string;
    role_id: string[];
  }): UserRoleAggregate {
    const userRoleId = data.id ? new UserRoleId(data.id) : undefined;
    const userRoleIdUser = new UserRoleIdUser(data.user_id);
    const userRoleIdRol = data.role_id.map((rolId) => new UserRoleIdRol(rolId));
    return new UserRoleAggregate(userRoleIdUser, userRoleIdRol, userRoleId);
  }
  // addRole(rol: Rol): void {
  //   this.role.push(rol);
  // }
  //   getRoles(): Rol[] {
  //     return this.role;
  //   }
  // }
}
