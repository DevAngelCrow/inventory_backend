import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateProductCommand } from './create-product.command';
import { ProductRepository } from '@/modules/inventory/domain/repositories/product-repository';
import { Product } from '@/modules/inventory/domain/entities/product';
import { StorageUploadService } from '@/modules/storage/application/services/storage/storage-upload.service';
import { StorageFilesContentFile } from '@/modules/storage/domain/value-objects/storage-files-value-object/storage-files-content-file';
import { StorageFiles } from '@/modules/storage/domain/entities/storage-files';

@CommandHandler(CreateProductCommand)
export class CreateProductHandler implements ICommandHandler<CreateProductCommand> {
  constructor(
    private readonly repository: ProductRepository,
    private readonly storageUploadService: StorageUploadService<Express.Multer.File>,
  ) {}

  async execute(command: CreateProductCommand): Promise<void> {
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
      active: true,
    });
    await this.repository.create(product);
  }
}
