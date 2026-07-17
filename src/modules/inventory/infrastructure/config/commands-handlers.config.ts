import { CreateProductCategoryHandler } from '../../application/product-category/commands/create-product-category/create-product-category.handler';
import { CreateMeasurementUnitHandler } from '../../application/commands/measurement-unit/create-measurement-unit/create-measurement-unit.handler';
import { UpdateMeasurementUnitHandler } from '../../application/commands/measurement-unit/update-measurement-unit/update-measurement-unit.handler';
import { DeleteMeasurementUnitHandler } from '../../application/commands/measurement-unit/delete-measurement-unit/delete-measurement-unit.handler';
import { UpdateProductCategoryHandler } from '../../application/product-category/commands/update-product-category/update-product-category.handler';
import { DeleteProductCategoryHandler } from '../../application/product-category/commands/delete-product-category/delete-product-category.handler';
import { CreateProductHandler } from '../../application/product/commands/create-product/create-product.handler';
import { UpdateProductHandler } from '../../application/product/commands/update-product/update-product.handler';
import { DeleteProductHandler } from '../../application/product/commands/delete-product/delete-product.handler';
import { CreateMaintenanceHandler } from '../../application/maintenance/commands/create-maintenance/create-maintenance.handler';
import { ResolveMaintenanceHandler } from '../../application/maintenance/commands/resolve-maintenance/resolve-maintenance.handler';
import { UpdateMaintenanceHandler } from '../../application/maintenance/commands/update-maintenance/update-maintenance.handler';

export const commandHandlerProviders = [
  CreateProductCategoryHandler,
  UpdateProductCategoryHandler,
  DeleteProductCategoryHandler,
  CreateProductHandler,
  UpdateProductHandler,
  DeleteProductHandler,
  CreateMaintenanceHandler,
  ResolveMaintenanceHandler,
  UpdateMaintenanceHandler,
  CreateMeasurementUnitHandler,
  UpdateMeasurementUnitHandler,
  DeleteMeasurementUnitHandler,
];
