import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserRepository } from '@/modules/identity-access-management/domain/repositories/user-repository';
import { UpdateNameUserCommand } from './update-name-user.command';
import { UserName } from '@/modules/identity-access-management/domain/value-objects/user-value-object/user-name';
import { UserId } from '@/modules/identity-access-management/domain/value-objects/user-value-object/user-id';

@CommandHandler(UpdateNameUserCommand)
export class UpdateNameUserHandler implements ICommandHandler<UpdateNameUserCommand> {
  constructor(private readonly repository: UserRepository) {}

  async execute(command: UpdateNameUserCommand): Promise<void> {
    const user = new UserName(command.user_name.value());
    const id = new UserId(command.id.value());
    return await this.repository.updateNameUser(user, id);
  }
}
