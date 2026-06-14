import { UserName } from '../../domain/value-objects/user-value-object/user-name';
import { UpdateNameUserCommand } from '../user/commands/update-name-user/update-name-user.command';
import { UpdateNameUserHandler } from '../user/commands/update-name-user/update-name-user.handler';
import { UserId } from '../../domain/value-objects/user-value-object/user-id';

export class UpdateUserNameService {
  constructor(private readonly updateUserName: UpdateNameUserHandler) {}
  async run(user_name: string, id: string): Promise<void> {
    const user = new UpdateNameUserCommand(
      new UserName(user_name),
      new UserId(id),
    );
    return await this.updateUserName.execute(user);
  }
}
