import { GlobalStatusDto } from '@/modules/catalogs/application/dtos/global-status.dto';

export interface DimensionValuesDto {
  width: number;
  height: number;
  depth?: number | null;
  unitId: string;
}

export class ProductDto {
  constructor(
    public readonly sku: string,
    public readonly name: string,
    public readonly description: string | undefined,
    public readonly rental_price: number,
    public readonly replacement_cost: number | undefined,
    public readonly total_stock: number,
    public readonly min_stock_alert: number,
    public readonly category_id: string,
    public readonly color: string | undefined,
    public readonly dimensions: DimensionValuesDto | undefined | null,
    public readonly weight_lbs: number | undefined,
    public readonly image_url: string | undefined,
    public readonly notes: string | undefined,
    public readonly active: boolean,
    public readonly id?: string,
    public readonly created_at?: Date | null,
    public readonly updated_at?: Date | null,
    public readonly status?: GlobalStatusDto,
  ) {}
}
