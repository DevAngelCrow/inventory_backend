import { UserRolDto } from '../../dtos/user-rol.dto';
import { CreateUserRoleCommand } from '../../user-rol/commands/create-user-role/create-user-role.command';
import { CreateUserRoleHandler } from '../../user-rol/commands/create-user-role/create-user-role.handler';

export class CreateUserRoleService {
  constructor(private readonly userRoleCreate: CreateUserRoleHandler) {}
  async run(user_role_dto: UserRolDto): Promise<void> {
    const command = new CreateUserRoleCommand(user_role_dto);
    return await this.userRoleCreate.execute(command);
  }
}
