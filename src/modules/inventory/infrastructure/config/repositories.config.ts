import { ProductCategoryRepository } from '../../domain/repositories/product-category-repository';
import { ProductCategoryQueriesRepository } from '../../application/repositories/product-category-read.repository';
import { ImplProductCategoryRepository } from '../implementation/product-category/impl-product-category.repository';
import { ProductRepository } from '../../domain/repositories/product-repository';
import { ProductQueriesRepository } from '../../application/repositories/product-read.repository';
import { ImplProductRepository } from '../implementation/product/impl-product.repository';

export const repositories = [
  { provide: ProductCategoryRepository, useClass: ImplProductCategoryRepository },
  { provide: ProductCategoryQueriesRepository, useClass: ImplProductCategoryRepository },
  { provide: ProductRepository, useClass: ImplProductRepository },
  { provide: ProductQueriesRepository, useClass: ImplProductRepository },
];
