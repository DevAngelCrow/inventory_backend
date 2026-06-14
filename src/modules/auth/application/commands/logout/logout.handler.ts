import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AuthReadPort } from '../../ports/auth-read.port';
import { LogoutCommand } from './logout.command';

@CommandHandler(LogoutCommand)
export class LogoutHandler implements ICommandHandler<LogoutCommand> {
  constructor(private readonly authReadPort: AuthReadPort) {}

  async execute(command: LogoutCommand): Promise<void> {
    const decodedToken = await this.authReadPort.decodeToken<{
      user_name: string;
      id: string;
      permissions: string[];
      exp: number;
      iat: number;
    }>(command.token, false);
    await this.authReadPort.blacklistAccessToken(
      decodedToken.id,
      decodedToken.exp,
    );
    await this.authReadPort.closeSession(decodedToken);
  }
}
