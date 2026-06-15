import { GetProductCategoriesHandler } from '../../application/product-category/queries/get-product-categories/get-product-categories.handler';
import { GetProductCategoryHandler } from '../../application/product-category/queries/get-product-category/get-product-category.handler';
import { GetProductsHandler } from '../../application/product/queries/get-products/get-products.handler';
import { GetProductHandler } from '../../application/product/queries/get-product/get-product.handler';
import { GetMaintenancesHandler } from '../../application/maintenance/queries/get-maintenances/get-maintenances.handler';
import { GetMaintenanceHandler } from '../../application/maintenance/queries/get-maintenance/get-maintenance.handler';

export const queryHandlerProviders = [
  GetProductCategoriesHandler,
  GetProductCategoryHandler,
  GetProductsHandler,
  GetProductHandler,
  GetMaintenancesHandler,
  GetMaintenanceHandler,
];
