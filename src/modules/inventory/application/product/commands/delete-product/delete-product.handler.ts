import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteProductCommand } from './delete-product.command';
import { ProductRepository } from '@/modules/inventory/domain/repositories/product-repository';
import { ProductId } from '@/modules/inventory/domain/value-objects/product-value-object/product-id';
import { Product } from '@/modules/inventory/domain/entities/product';

@CommandHandler(DeleteProductCommand)
export class DeleteProductHandler implements ICommandHandler<DeleteProductCommand> {
  constructor(private readonly repository: ProductRepository) {}

  async execute(command: DeleteProductCommand): Promise<Product> {
    const id = new ProductId(command.id);
    return await this.repository.toggleStatus(id);
  }
}
