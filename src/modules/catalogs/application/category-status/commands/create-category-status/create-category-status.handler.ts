import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CategoryStatusRepository } from '@/modules/catalogs/domain/repositories/category-status-repository';
import { CreateCategoryStatusCommand } from './create-category-status.command';
import { CategoryStatus } from '@/modules/catalogs/domain/entities/category-status';

@CommandHandler(CreateCategoryStatusCommand)
export class CreateCategoryStatusHandler implements ICommandHandler<CreateCategoryStatusCommand> {
  constructor(private readonly repository: CategoryStatusRepository) {}

  async execute(command: CreateCategoryStatusCommand): Promise<void> {
    const categoryStatus = CategoryStatus.create({
      ...command.category_status_dto,
    });
    await this.repository.create(categoryStatus);
  }
}
