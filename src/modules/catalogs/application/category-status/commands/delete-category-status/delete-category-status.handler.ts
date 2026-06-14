import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CategoryStatusRepository } from '@/modules/catalogs/domain/repositories/category-status-repository';
import { DeleteCategoryStatusCommand } from './delete-category-status.command';
import { NotFoundException } from '@/shared/domain/exceptions/not-found.exception';
import { CategoryStatusQueriesRepository } from '../../../repositories/category-status-read.repository';
import { CategoryStatusId } from '@/modules/catalogs/domain/value-objects/category-status-value-object/category-status-id';
import { CategoryStatusDto } from '../../../dtos/category-status.dto';

@CommandHandler(DeleteCategoryStatusCommand)
export class DeleteCategoryStatusHandler implements ICommandHandler<DeleteCategoryStatusCommand> {
  constructor(
    private readonly repository: CategoryStatusRepository,
    private readonly readRepository: CategoryStatusQueriesRepository,
  ) {}
  async execute(
    command: DeleteCategoryStatusCommand,
  ): Promise<CategoryStatusDto> {
    const categoryStatus = await this.readRepository.getOneById(command.id);
    if (!categoryStatus) {
      throw new NotFoundException('CategoryStatus', command.id.toString());
    }
    const categoryStatusId = categoryStatus.id;
    if (!categoryStatusId) {
      throw new Error(`CategoryStatus id is undefined`);
    }

    const categoryStatusEntity = await this.repository.toggleStatus(
      new CategoryStatusId(categoryStatusId),
    );

    const categoryStatusDto =
      CategoryStatusDto.fromEntity(categoryStatusEntity);

    return categoryStatusDto;
  }
}
