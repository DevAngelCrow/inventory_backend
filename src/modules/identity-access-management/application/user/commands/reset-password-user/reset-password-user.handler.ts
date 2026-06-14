import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserRepository } from '@/modules/identity-access-management/domain/repositories/user-repository';
import { ResetPasswordUserCommand } from './reset-password-user.command';
import { UserId } from '@/modules/identity-access-management/domain/value-objects/user-value-object/user-id';
import { UserPassword } from '@/modules/identity-access-management/domain/value-objects/user-value-object/user-password';

@CommandHandler(ResetPasswordUserCommand)
export class ResetPasswordUserHandler implements ICommandHandler<ResetPasswordUserCommand> {
  constructor(private readonly repository: UserRepository) {}
  async execute(command: ResetPasswordUserCommand): Promise<void> {
    await this.repository.resetPasswordUser(
      new UserId(command.id),
      new UserPassword(command.password),
      command.token,
    );
  }
}
