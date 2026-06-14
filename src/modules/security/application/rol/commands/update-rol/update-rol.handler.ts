import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RolRepository } from '@/modules/security/domain/repositories/rol-repository';
import { UpdateRolCommand } from './update-rol.command';
import { Rol } from '@/modules/security/domain/entities/rol';
import { UsersRoleReadRepository } from '../../../repositories/user-rol-read.repository';
import { CachePort } from '@/modules/security/domain/ports/cache.port';

@CommandHandler(UpdateRolCommand)
export class UpdateRolHandler implements ICommandHandler<UpdateRolCommand> {
  constructor(
    private readonly repository: RolRepository,
    private readonly userRoleRepository: UsersRoleReadRepository,
    private readonly cacheManager: CachePort,
  ) {}

  async execute(command: UpdateRolCommand): Promise<void> {
    if (!command.rol_dto.id) {
      throw new Error('El ID del rol es requerido para actualizar');
    }
    const rol = Rol.create({
      ...command.rol_dto,
      id_permissions: command.rol_dto.permissions_id,
    });
    await this.repository.update(rol);
    const userIds = await this.userRoleRepository.getUserIdsByRoleId(
      command.rol_dto.id,
    );
    await this.cacheManager.invalidateUsersPermissions(userIds);
  }
}
