import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateProductCommand } from './update-product.command';
import { ProductRepository } from '@/modules/inventory/domain/repositories/product-repository';
import { ProductQueriesRepository } from '@/modules/inventory/application/repositories/product-read.repository';
import { Product } from '@/modules/inventory/domain/entities/product';
import { NotFoundException } from '@/shared/domain/exceptions/not-found.exception';

@CommandHandler(UpdateProductCommand)
export class UpdateProductHandler implements ICommandHandler<UpdateProductCommand> {
  constructor(
    private readonly repository: ProductRepository,
    private readonly queryRepository: ProductQueriesRepository,
  ) {}

  async execute(command: UpdateProductCommand): Promise<void> {
    const existing = await this.queryRepository.findById(command.id);
    if (!existing) {
      throw new NotFoundException('Product', command.id);
    }
    const product = Product.create({
      id: command.id,
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
      active: existing.active,
    });
    await this.repository.update(product);
  }
}
