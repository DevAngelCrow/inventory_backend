import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateProductCategoryCommand } from './update-product-category.command';
import { ProductCategoryRepository } from '@/modules/inventory/domain/repositories/product-category-repository';
import { ProductCategoryQueriesRepository } from '@/modules/inventory/application/repositories/product-category-read.repository';
import { ProductCategory } from '@/modules/inventory/domain/entities/product-category';
import { NotFoundException } from '@/shared/domain/exceptions/not-found.exception';

@CommandHandler(UpdateProductCategoryCommand)
export class UpdateProductCategoryHandler
  implements ICommandHandler<UpdateProductCategoryCommand>
{
  constructor(
    private readonly repository: ProductCategoryRepository,
    private readonly queryRepository: ProductCategoryQueriesRepository,
  ) {}

  async execute(command: UpdateProductCategoryCommand): Promise<void> {
    const existing = await this.queryRepository.findById(command.id);
    if (!existing) {
      throw new NotFoundException('ProductCategory', command.id);
    }
    const productCategory = ProductCategory.create({
      id: command.id,
      name: command.name,
      description: command.description,
      icon: command.icon,
      active: existing.active,
    });
    await this.repository.update(productCategory);
  }
}
