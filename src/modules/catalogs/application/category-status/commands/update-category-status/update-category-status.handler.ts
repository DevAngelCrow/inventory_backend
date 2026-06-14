import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CategoryStatus } from '@/modules/catalogs/domain/entities/category-status';
import { UpdateCategoryStatusCommand } from './update-category-status.command';
import { CategoryStatusRepository } from '@/modules/catalogs/domain/repositories/category-status-repository';
import { NotFoundException } from '@/shared/domain/exceptions/not-found.exception';
import { CategoryStatusQueriesRepository } from '../../../repositories/category-status-read.repository';

@CommandHandler(UpdateCategoryStatusCommand)
export class UpdateCategoryStatusHandler implements ICommandHandler<UpdateCategoryStatusCommand> {
  constructor(
    private readonly repository: CategoryStatusRepository,
    private readonly readRepository: CategoryStatusQueriesRepository,
  ) {}
  async execute(command: UpdateCategoryStatusCommand): Promise<void> {
    const categoryStatus = CategoryStatus.create({
      ...command.category_status_dto,
    });
    const categoryStatusId = categoryStatus.getId();
    if (!categoryStatusId) {
      throw new Error(`CategoryStatus id is undefined`);
    }
    const foundCategoryStatus = await this.readRepository.getOneById(
      categoryStatusId.value(),
    );
    if (!foundCategoryStatus) {
      throw new NotFoundException(
        'CategoryStatus',
        categoryStatusId.value().toString(),
      );
    }
    await this.repository.update(categoryStatus);
  }
}
