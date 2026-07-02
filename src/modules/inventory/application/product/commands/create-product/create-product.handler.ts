import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateProductCommand } from './create-product.command';
import { ProductRepository } from '@/modules/inventory/domain/repositories/product-repository';
import { Product } from '@/modules/inventory/domain/entities/product';

@CommandHandler(CreateProductCommand)
export class CreateProductHandler implements ICommandHandler<CreateProductCommand> {
  constructor(private readonly repository: ProductRepository) {}

  async execute(command: CreateProductCommand): Promise<void> {
    const product = Product.create({
      sku: command.sku,
      name: command.name,
      description: command.description,
      rental_price: command.rental_price,
      replacement_cost: command.replacement_cost,
      total_stock: command.total_stock,
      min_stock_alert: command.min_stock_alert,
      category_id: command.category_id,
      color: command.color,
      dimensions: command.dimensions,
      weight_lbs: command.weight_lbs,
      image_url: command.image_url,
      notes: command.notes,
      active: true,
    });
    await this.repository.create(product);
  }
}
