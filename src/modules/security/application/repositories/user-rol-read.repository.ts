import { UserRolExtendedDto } from '../dtos/user-rol-extended.dto';

export abstract class UsersRoleReadRepository {
  abstract getUserRole(id: string): Promise<UserRolExtendedDto | null>;
  abstract getUserIdsByRoleId(id_rol: string): Promise<string[]>;
  abstract getUserIdsByPermissionId(permissionId: string): Promise<string[]>;
}
