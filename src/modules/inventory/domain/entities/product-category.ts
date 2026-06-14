import { ProductCategoryId } from '../value-objects/product-category-value-object/product-category-id';
import { ProductCategoryName } from '../value-objects/product-category-value-object/product-category-name';
import { ProductCategoryDescription } from '../value-objects/product-category-value-object/product-category-description';

export class ProductCategory {
  constructor(
    private readonly name: ProductCategoryName,
    private readonly description: ProductCategoryDescription,
    private readonly icon: string | undefined,
    private readonly active: boolean,
    private readonly id?: ProductCategoryId,
  ) {}

  static create(data: {
    name: string;
    description?: string;
    icon?: string;
    active: boolean;
    id?: string;
  }): ProductCategory {
    return new ProductCategory(
      new ProductCategoryName(data.name),
      new ProductCategoryDescription(data.description),
      data.icon,
      data.active,
      data.id ? new ProductCategoryId(data.id) : undefined,
    );
  }

  public getId(): ProductCategoryId | undefined {
    return this.id;
  }

  public getName(): ProductCategoryName {
    return this.name;
  }

  public getDescription(): ProductCategoryDescription {
    return this.description;
  }

  public getIcon(): string | undefined {
    return this.icon;
  }

  public getActive(): boolean {
    return this.active;
  }
}
