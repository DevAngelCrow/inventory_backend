import { UserRolDto } from '../../../dtos/user-rol.dto';

export class CreateUserRoleCommand {
  constructor(public readonly user_role_dto: UserRolDto) {}
}
