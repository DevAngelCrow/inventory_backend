import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AuthReadPort } from '../../ports/auth-read.port';
import { RefreshCommand } from './refresh.command';
import { FindUserByIdService } from '@/modules/identity-access-management/application/services/find-user-by-id.service';
import { NotFoundException } from '@/shared/domain/exceptions/not-found.exception';
import { UnauthorizedException } from '@/shared/application/exceptions/unauthorized.exception';
import { CreateOrUpdateRefreshTokenPort } from '@/modules/auth/domain/ports/create-or-update-refresh-token.port';
import { AuthenticateDto } from '../../dtos/authenticate.dto';
import { UserAuthDto } from '@/modules/identity-access-management/application/dtos/user-auth.dto';

@CommandHandler(RefreshCommand)
export class RefreshHandler implements ICommandHandler<RefreshCommand> {
  constructor(
    private readonly authReadPort: AuthReadPort,
    private readonly findUserByIdService: FindUserByIdService,
    private readonly createOrUpdateRefreshToken: CreateOrUpdateRefreshTokenPort,
  ) {}

  async execute(command: RefreshCommand): Promise<AuthenticateDto> {
    const decodedToken = await this.authReadPort.decodeToken<{
      user_name: string;
      id: string;
      permissions: string[];
      refresh_token: string;
      id_session_refresh_token?: string;
    }>(command.incoming_refresh_token, true);
    const user = await this.findUserByIdService.run(decodedToken.id);
    const userId = user?.id;
    if (!userId || !user) {
      throw new NotFoundException(`User`, decodedToken.id.toString());
    }
    const storedRefreshTokenHash =
      await this.authReadPort.findRefreshTokenByIdUser(decodedToken.id);
    if (!storedRefreshTokenHash) {
      throw new NotFoundException(
        `Refresh token for user`,
        decodedToken.id.toString(),
      );
    }
    const isMatch = await this.authReadPort.compareToken(
      command.incoming_refresh_token,
      storedRefreshTokenHash,
    );
    if (!isMatch) {
      throw new UnauthorizedException(`Refresh token for user`);
    }

    const userAuthDto = new UserAuthDto(
      user.id,
      user.id_people,
      user.user_name,
      user.id_status,
      user.last_access,
      user.is_validated,
      user.permissions,
      user.id_session_refresh_token,
    );
    await this.authReadPort.clearAccessTokenBlacklist(user.id);
    const newToken = await this.authReadPort.generateToken(userAuthDto);
    const newRefreshToken =
      await this.authReadPort.generateRefreshToken(userAuthDto);
    const { exp } = await this.authReadPort.decodeToken<{ exp: number }>(
      newRefreshToken,
      true,
    );
    const authenticateDto = new AuthenticateDto(
      user.user_name,
      user.id,
      newToken,
      newRefreshToken,
    );
    await this.createOrUpdateRefreshToken.createUpdate(
      authenticateDto.id,
      newRefreshToken,
      new Date(exp * 1000),
    );
    return authenticateDto;
  }
}
