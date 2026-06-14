import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PermissionsRepository } from '@/modules/security/domain/repositories/permissions-repository';
import { UpdatePermissionsCommand } from './update-permissions.command';
import { Permissions } from '@/modules/security/domain/entities/permissions';
import { UsersRoleReadRepository } from '../../../repositories/user-rol-read.repository';
import { CachePort } from '@/modules/security/domain/ports/cache.port';

@CommandHandler(UpdatePermissionsCommand)
export class UpdatePermissionsHandler implements ICommandHandler<UpdatePermissionsCommand> {
  constructor(
    private readonly repository: PermissionsRepository,
    private readonly userRoleRepository: UsersRoleReadRepository,
    private readonly cache: CachePort,
  ) {}

  async execute(command: UpdatePermissionsCommand): Promise<void> {
    const permissions = Permissions.create({ ...command.permissions_dto });
    await this.repository.update(permissions);
    if (command.permissions_dto.id) {
      const userIds = await this.userRoleRepository.getUserIdsByPermissionId(
        command.permissions_dto.id,
      );
      await this.cache.invalidateUsersPermissions(userIds);
    }
  }
}
