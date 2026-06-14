import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RolRepository } from '@/modules/security/domain/repositories/rol-repository';
import { DeleteRolCommand } from './delete-rol.command';
import { RolId } from '@/modules/security/domain/value-objects/rol-value-object/rol-id';
import { RolDto } from '../../../dtos/rol.dto';
import { UsersRoleReadRepository } from '../../../repositories/user-rol-read.repository';
import { CachePort } from '@/modules/security/domain/ports/cache.port';

@CommandHandler(DeleteRolCommand)
export class DeleteRolHandler implements ICommandHandler<DeleteRolCommand> {
  constructor(
    private readonly repository: RolRepository,
    private readonly userRoleRepository: UsersRoleReadRepository,
    private readonly cache: CachePort,
  ) {}

  async execute(command: DeleteRolCommand): Promise<RolDto> {
    const userIds: string[] = await this.userRoleRepository.getUserIdsByRoleId(
      command.id,
    );
    const rolEntity = await this.repository.toggleStatus(new RolId(command.id));
    await this.cache.invalidateUsersPermissions(userIds);
    const rolDto = RolDto.fromEntity(rolEntity);
    return rolDto;
  }
}
