import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserRoleRepository } from '@/modules/security/domain/repositories/user-rol-repository';
import { CreateUserRoleCommand } from './create-user-role.command';
import { UserRoleAggregate } from '@/modules/security/domain/aggregates/user-role.aggregate';
import { CachePort } from '@/modules/security/domain/ports/cache.port';

@CommandHandler(CreateUserRoleCommand)
export class CreateUserRoleHandler implements ICommandHandler<CreateUserRoleCommand> {
  constructor(
    protected readonly repository: UserRoleRepository,
    protected readonly cache: CachePort,
  ) {}
  async execute(command: CreateUserRoleCommand): Promise<void> {
    const userRoleAggregate = UserRoleAggregate.create(command.user_role_dto);
    await this.repository.create(userRoleAggregate);
    await this.cache.invalidateUserPermissions(command.user_role_dto.user_id);
  }
}
