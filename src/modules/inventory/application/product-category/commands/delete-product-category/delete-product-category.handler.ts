import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteProductCategoryCommand } from './delete-product-category.command';
import { ProductCategoryRepository } from '@/modules/inventory/domain/repositories/product-category-repository';
import { ProductCategory } from '@/modules/inventory/domain/entities/product-category';
import { ProductCategoryId } from '@/modules/inventory/domain/value-objects/product-category-value-object/product-category-id';

@CommandHandler(DeleteProductCategoryCommand)
export class DeleteProductCategoryHandler
  implements ICommandHandler<DeleteProductCategoryCommand>
{
  constructor(
    private readonly repository: ProductCategoryRepository,
  ) {}

  async execute(command: DeleteProductCategoryCommand): Promise<ProductCategory> {
    const id = new ProductCategoryId(command.id);
    return await this.repository.toggleStatus(id);
  }
}
