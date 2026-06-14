import { UserRolDto } from '../../../dtos/user-rol.dto';

export class UpdateUserRoleByIdCommand {
  constructor(public readonly user_rol_dto: UserRolDto) {}
}
