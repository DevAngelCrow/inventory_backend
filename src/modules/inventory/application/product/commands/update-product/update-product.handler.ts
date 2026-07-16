import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateProductCommand } from './update-product.command';
import { ProductRepository } from '@/modules/inventory/domain/repositories/product-repository';
import { ProductQueriesRepository } from '@/modules/inventory/application/repositories/product-read.repository';
import { Product } from '@/modules/inventory/domain/entities/product';
import { NotFoundException } from '@/shared/domain/exceptions/not-found.exception';
import { StorageUploadService } from '@/modules/storage/application/services/storage/storage-upload.service';
import { StorageFilesContentFile } from '@/modules/storage/domain/value-objects/storage-files-value-object/storage-files-content-file';
import { StorageFiles } from '@/modules/storage/domain/entities/storage-files';

@CommandHandler(UpdateProductCommand)
export class UpdateProductHandler implements ICommandHandler<UpdateProductCommand> {
  constructor(
    private readonly repository: ProductRepository,
    private readonly queryRepository: ProductQueriesRepository,
    private readonly storageUploadService: StorageUploadService<Express.Multer.File>,
  ) {}

  async execute(command: UpdateProductCommand): Promise<void> {
    const existing = await this.queryRepository.findById(command.id);
    if (!existing) {
      throw new NotFoundException('Product', command.id);
    }

    let finalImageUrl = command.image_url;

    if (command.image_file && command.provider_storage_code) {
      const storageFileDto = new StorageFilesContentFile(command.image_file);
      const storageFile: StorageFiles<Express.Multer.File> = await this.storageUploadService.run(
        storageFileDto.value(),
        command.provider_storage_code,
        'inventory_img',
      );
      finalImageUrl = storageFile.getPath().value();
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
      image_url: finalImageUrl,
      notes: command.notes,
      active: existing.active,
    });
    await this.repository.update(product);
  }
}
