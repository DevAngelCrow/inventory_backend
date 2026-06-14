import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateOrUpdateRefreshTokenPort } from '@/modules/auth/domain/ports/create-or-update-refresh-token.port';
import { CreateUpdateRefreshTokenCommand } from './create-update-refresh-token.command';

@CommandHandler(CreateUpdateRefreshTokenCommand)
export class CreateUpdateRefreshTokenHandler implements ICommandHandler<CreateUpdateRefreshTokenCommand> {
  constructor(
    private readonly createUpdateRefreshToken: CreateOrUpdateRefreshTokenPort,
  ) {}
  async execute(command: CreateUpdateRefreshTokenCommand): Promise<void> {
    const { id_user, refresh_token, expired_at } = command;
    return await this.createUpdateRefreshToken.createUpdate(
      id_user,
      refresh_token,
      expired_at,
    );
  }
}
