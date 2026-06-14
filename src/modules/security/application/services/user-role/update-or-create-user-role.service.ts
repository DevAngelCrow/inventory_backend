import { UserRolDto } from '../../dtos/user-rol.dto';
import { UpdateUserRoleByIdCommand } from '../../user-rol/commands/update-user-role-by-id/update-user-role-by-id.command';
import { UpdateUserRoleByIdHandler } from '../../user-rol/commands/update-user-role-by-id/update-user-role-by-id.handler';

export class UpdateOrCreateUserRoleService {
  constructor(
    private readonly userRoleUpdateOrCreate: UpdateUserRoleByIdHandler,
  ) {}
  async run(user_role_dto: UserRolDto): Promise<void> {
    const command = new UpdateUserRoleByIdCommand(user_role_dto);
    return await this.userRoleUpdateOrCreate.execute(command);
  }
}
