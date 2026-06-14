import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserRoleRepository } from '@/modules/security/domain/repositories/user-rol-repository';
import { UpdateUserRoleByIdCommand } from './update-user-role-by-id.command';
import { UserRoleAggregate } from '@/modules/security/domain/aggregates/user-role.aggregate';
import { CachePort } from '@/modules/security/domain/ports/cache.port';

@CommandHandler(UpdateUserRoleByIdCommand)
export class UpdateUserRoleByIdHandler implements ICommandHandler<UpdateUserRoleByIdCommand> {
  constructor(
    private readonly repository: UserRoleRepository,
    private readonly cache: CachePort,
  ) {}
  async execute(command: UpdateUserRoleByIdCommand): Promise<void> {
    const userRoleAggregate = UserRoleAggregate.create({
      ...command.user_rol_dto,
    });
    await this.repository.updateOrCreate(userRoleAggregate);
    await this.cache.invalidateUserPermissions(command.user_rol_dto.user_id);
  }
}
