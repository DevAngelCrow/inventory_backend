import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CategoryPermissionsRepository } from '@/modules/security/domain/repositories/category-permissions-repository';
import { DeleteCategoryPermissionsCommand } from './delete-category-permissions.command';
import { CategoryPermissionsId } from '@/modules/security/domain/value-objects/category-permissions-value-object/category-permissions-id';
import { CategoryPermissionsDto } from '../../../dtos/category-permissions.dto';

@CommandHandler(DeleteCategoryPermissionsCommand)
export class DeleteCategoryPermissionsHandler implements ICommandHandler<DeleteCategoryPermissionsCommand> {
  constructor(private readonly repository: CategoryPermissionsRepository) {}

  async execute(
    command: DeleteCategoryPermissionsCommand,
  ): Promise<CategoryPermissionsDto> {
    const categoryPermissionsEntity = await this.repository.toggleStatus(
      new CategoryPermissionsId(command.id),
    );
    const categoryPermissionsDto = CategoryPermissionsDto.fromEntity(
      categoryPermissionsEntity,
    );
    return categoryPermissionsDto;
  }
}
