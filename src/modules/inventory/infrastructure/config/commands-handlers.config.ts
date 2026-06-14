import { CreateProductCategoryHandler } from '../../application/product-category/commands/create-product-category/create-product-category.handler';
import { UpdateProductCategoryHandler } from '../../application/product-category/commands/update-product-category/update-product-category.handler';
import { DeleteProductCategoryHandler } from '../../application/product-category/commands/delete-product-category/delete-product-category.handler';
import { CreateProductHandler } from '../../application/product/commands/create-product/create-product.handler';
import { UpdateProductHandler } from '../../application/product/commands/update-product/update-product.handler';
import { DeleteProductHandler } from '../../application/product/commands/delete-product/delete-product.handler';

export const commandHandlerProviders = [
  CreateProductCategoryHandler,
  UpdateProductCategoryHandler,
  DeleteProductCategoryHandler,
  CreateProductHandler,
  UpdateProductHandler,
  DeleteProductHandler,
];
