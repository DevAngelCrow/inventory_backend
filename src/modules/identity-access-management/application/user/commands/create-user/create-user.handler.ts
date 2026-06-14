import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserRepository } from '@/modules/identity-access-management/domain/repositories/user-repository';
import { CreateUserCommand } from './create-user.command';
import { User } from '@/modules/identity-access-management/domain/entities/user';

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(private readonly repository: UserRepository) {}

  async execute(command: CreateUserCommand): Promise<User> {
    const user = User.create({ ...command.user_dto });
    return await this.repository.create(user);
  }
}
