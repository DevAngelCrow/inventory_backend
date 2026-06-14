import { ProductCategoryDto } from '@/modules/inventory/application/dtos/product-category.dto';

export class ProductCategoryHttpDto {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly description: string | undefined,
    public readonly icon: string | undefined,
    public readonly active: boolean,
    public readonly created_at?: Date | null,
    public readonly updated_at?: Date | null,
  ) {}

  public static fromDto(dto: ProductCategoryDto): ProductCategoryHttpDto {
    return new ProductCategoryHttpDto(
      dto.id!,
      dto.name,
      dto.description,
      dto.icon,
      dto.active,
      dto.created_at,
      dto.updated_at,
    );
  }
}
