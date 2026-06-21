import { ProductDto } from '@/modules/inventory/application/dtos/product.dto';
import { GlobalStatusDto } from '@/modules/catalogs/application/dtos/global-status.dto';

export class ProductHttpDto {
  constructor(
    public readonly id: string,
    public readonly sku: string,
    public readonly name: string,
    public readonly description: string | undefined,
    public readonly rental_price: number,
    public readonly replacement_cost: number | undefined,
    public readonly total_stock: number,
    public readonly min_stock_alert: number,
    public readonly category_id: string,
    public readonly color: string | undefined,
    public readonly dimensions: string | undefined,
    public readonly weight_lbs: number | undefined,
    public readonly image_url: string | undefined,
    public readonly notes: string | undefined,
    public readonly active: boolean,
    public readonly created_at?: Date | null,
    public readonly updated_at?: Date | null,
    public readonly status?: GlobalStatusDto,
  ) {}

  public static fromDto(dto: ProductDto): ProductHttpDto {
    return new ProductHttpDto(
      dto.id!,
      dto.sku,
      dto.name,
      dto.description,
      dto.rental_price,
      dto.replacement_cost,
      dto.total_stock,
      dto.min_stock_alert,
      dto.category_id,
      dto.color,
      dto.dimensions,
      dto.weight_lbs,
      dto.image_url,
      dto.notes,
      dto.active,
      dto.created_at,
      dto.updated_at,
      dto.status,
    );
  }
}
