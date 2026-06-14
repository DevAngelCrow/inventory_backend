import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AuthReadPort } from '../../ports/auth-read.port';
import { RevokeAllSessionsCommand } from './revoke-all-sessions.command';

@CommandHandler(RevokeAllSessionsCommand)
export class RevokeAllSessionsHandler implements ICommandHandler<RevokeAllSessionsCommand> {
  constructor(private readonly authReadPort: AuthReadPort) {}

  async execute(command: RevokeAllSessionsCommand): Promise<void> {
    // Decode current token to get expiry for blacklisting
    const decoded = await this.authReadPort.decodeToken<{
      id: string;
      exp: number;
    }>(command.currentAccessToken, false);

    // Blacklist the current access token
    await this.authReadPort.blacklistAccessToken(decoded.id, decoded.exp);

    // Revoke all refresh sessions (sets revoked_at + deletes)
    await this.authReadPort.closeSession({ id: command.userId });
  }
}
