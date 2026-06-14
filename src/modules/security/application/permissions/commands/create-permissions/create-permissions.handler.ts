import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PermissionsRepository } from '@/modules/security/domain/repositories/permissions-repository';
import { CreatePermissionsCommand } from './create-permissions.command';
import { Permissions } from '@/modules/security/domain/entities/permissions';

@CommandHandler(CreatePermissionsCommand)
export class CreatePermissionsHandler implements ICommandHandler<CreatePermissionsCommand> {
  constructor(private readonly repository: PermissionsRepository) {}

  async execute(command: CreatePermissionsCommand): Promise<void> {
    const permissions = Permissions.create({ ...command.permissions_dto });
    await this.repository.create(permissions);
  }
}
