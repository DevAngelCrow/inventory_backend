import { DimensionValuesDto } from '../../../../infrastructure/dtos/validators/product/create-product.dto';

export class CreateProductCommand {
  constructor(
    public readonly sku: string,
    public readonly name: string,
    public readonly rental_price: number,
    public readonly total_stock: number,
    public readonly category_id: string,
    public readonly description?: string,
    public readonly replacement_cost?: number,
    public readonly min_stock_alert?: number,
    public readonly color?: string,
    public readonly dimensions?: DimensionValuesDto | null,
    public readonly weight_lbs?: number,
    public readonly image_url?: string,
    public readonly notes?: string,
    public readonly image_file?: Express.Multer.File,
    public readonly provider_storage_code?: string,
  ) {}
}
