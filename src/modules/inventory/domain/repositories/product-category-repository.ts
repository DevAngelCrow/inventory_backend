import { ProductCategory } from '../entities/product-category';
import { ProductCategoryId } from '../value-objects/product-category-value-object/product-category-id';

export abstract class ProductCategoryRepository {
  abstract create(productCategory: ProductCategory): Promise<void>;
  abstract update(productCategory: ProductCategory): Promise<void>;
  abstract toggleStatus(id: ProductCategoryId): Promise<ProductCategory>;
}
