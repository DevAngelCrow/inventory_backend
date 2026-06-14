import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AuthReadPort } from '../../ports/auth-read.port';
import { RevokeSessionCommand } from './revoke-session.command';

@CommandHandler(RevokeSessionCommand)
export class RevokeSessionHandler implements ICommandHandler<RevokeSessionCommand> {
  constructor(private readonly authReadPort: AuthReadPort) {}

  async execute(command: RevokeSessionCommand): Promise<void> {
    await this.authReadPort.revokeSession(command.sessionId, command.userId);
  }
}
