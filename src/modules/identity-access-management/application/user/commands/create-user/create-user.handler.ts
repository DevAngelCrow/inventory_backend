import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EventDispatcherPort } from '@/shared/domain/ports/event-dispatcher.port';
import { UserRepository } from '@/modules/identity-access-management/domain/repositories/user-repository';
import { CreateUserCommand } from './create-user.command';
import { User } from '@/modules/identity-access-management/domain/entities/user';
import { PasswordHasherPort } from '@/modules/identity-access-management/domain/ports/password-hasher.port';

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    private readonly repository: UserRepository,
    private readonly dispatcher: EventDispatcherPort,
    private readonly passwordHasherPort: PasswordHasherPort,
  ) {}

  async execute(command: CreateUserCommand): Promise<User> {
    const hashedPassword = await this.passwordHasherPort.hash(
      command.user_dto.password,
    );
    const userDto = { ...command.user_dto, password: hashedPassword };
    const user = User.create(userDto);

    const createdUser = await this.repository.create(user);
    createdUser.created();

    await this.dispatcher.dispatch(createdUser.getDomainEvents());
    createdUser.clearDomainEvents();

    return createdUser;
  }
}
