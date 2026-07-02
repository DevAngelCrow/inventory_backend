import { Product } from '../entities/product';
import { ProductId } from '../value-objects/product-value-object/product-id';

export abstract class ProductRepository {
  abstract create(product: Product): Promise<void>;
  abstract update(product: Product): Promise<void>;
  abstract toggleStatus(id: ProductId): Promise<Product>;
}
