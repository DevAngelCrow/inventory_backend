import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CategoryPermissionsRepository } from '@/modules/security/domain/repositories/category-permissions-repository';
import { UpdateCategoryPermissionsCommand } from './update-category-permissions.command';
import { CategoryPermissions } from '@/modules/security/domain/entities/category-permissions';

@CommandHandler(UpdateCategoryPermissionsCommand)
export class UpdateCategoryPermissionsHandler implements ICommandHandler<UpdateCategoryPermissionsCommand> {
  constructor(private readonly repository: CategoryPermissionsRepository) {}

  async execute(command: UpdateCategoryPermissionsCommand): Promise<void> {
    const categoryPermissions = CategoryPermissions.create({
      ...command.category_permissions_dto,
    });
    await this.repository.update(categoryPermissions);
  }
}
