import { CommandHandler, ICommandHandler, EventPublisher } from '@nestjs/cqrs';
import { UserRepository } from '@/modules/identity-access-management/domain/repositories/user-repository';
import { CreateUserCommand } from './create-user.command';
import { User } from '@/modules/identity-access-management/domain/entities/user';
import { PasswordHasherPort } from '@/modules/identity-access-management/domain/ports/password-hasher.port';

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    private readonly repository: UserRepository,
    private readonly publisher: EventPublisher,
    private readonly passwordHasherPort: PasswordHasherPort,
  ) {}

  async execute(command: CreateUserCommand): Promise<User> {
    const hashedPassword = await this.passwordHasherPort.hash(command.user_dto.password);
    const user = User.create({ ...command.user_dto, password: hashedPassword });
    return await this.repository.create(user);
  }
}
