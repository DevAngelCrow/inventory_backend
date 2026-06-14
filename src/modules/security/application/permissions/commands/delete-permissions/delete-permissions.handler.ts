import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PermissionsRepository } from '@/modules/security/domain/repositories/permissions-repository';
import { DeletePermissionsCommand } from './delete-permissions.command';
import { PermissionsId } from '@/modules/security/domain/value-objects/permissions-value-object/permissions-id';
import { PermissionsDto } from '../../../dtos/permissions.dto';
import { UsersRoleReadRepository } from '../../../repositories/user-rol-read.repository';
import { CachePort } from '@/modules/security/domain/ports/cache.port';

@CommandHandler(DeletePermissionsCommand)
export class DeletePermissionsHandler implements ICommandHandler<DeletePermissionsCommand> {
  constructor(
    private readonly repository: PermissionsRepository,
    private readonly userRoleRepository: UsersRoleReadRepository,
    private readonly cache: CachePort,
  ) {}

  async execute(command: DeletePermissionsCommand): Promise<PermissionsDto> {
    const userIds = await this.userRoleRepository.getUserIdsByPermissionId(
      command.id,
    );
    const permissionsEntity = await this.repository.toggleStatus(
      new PermissionsId(command.id),
    );
    await this.cache.invalidateUsersPermissions(userIds);
    const permissionsDto = PermissionsDto.fromEntity(permissionsEntity);
    return permissionsDto;
  }
}
