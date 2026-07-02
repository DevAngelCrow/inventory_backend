import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateProductCategoryCommand } from './create-product-category.command';
import { ProductCategoryRepository } from '@/modules/inventory/domain/repositories/product-category-repository';
import { ProductCategory } from '@/modules/inventory/domain/entities/product-category';

@CommandHandler(CreateProductCategoryCommand)
export class CreateProductCategoryHandler implements ICommandHandler<CreateProductCategoryCommand> {
  constructor(private readonly repository: ProductCategoryRepository) {}

  async execute(command: CreateProductCategoryCommand): Promise<void> {
    const productCategory = ProductCategory.create({
      name: command.name,
      description: command.description,
      icon: command.icon,
      active: true,
    });
    await this.repository.create(productCategory);
  }
}
