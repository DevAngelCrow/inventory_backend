import { ProductCategoryRepository } from '../../domain/repositories/product-category-repository';
import { MeasurementUnitRepository } from '../../domain/repositories/measurement-unit-repository';
import { MeasurementUnitQueriesRepository } from '../../application/repositories/measurement-unit-read.repository';
import { PrismaMeasurementUnitRepository } from '../repositories/prisma-measurement-unit.repository';
import { PrismaMeasurementUnitQueriesRepository } from '../repositories/prisma-measurement-unit-queries.repository';
import { ProductCategoryQueriesRepository } from '../../application/repositories/product-category-read.repository';
import { ImplProductCategoryRepository } from '../implementation/product-category/impl-product-category.repository';
import { ProductRepository } from '../../domain/repositories/product-repository';
import { ProductQueriesRepository } from '../../application/repositories/product-read.repository';
import { ImplProductRepository } from '../implementation/product/impl-product.repository';
import { MAINTENANCE_REPOSITORY } from '../../domain/repositories/maintenance.repository';
import { PrismaMaintenanceRepository } from '../repositories/prisma-maintenance.repository';
import { AVAILABILITY_REPOSITORY } from '../../domain/repositories/availability.repository';
import { PrismaAvailabilityRepository } from '../repositories/prisma-availability.repository';
import { MaintenanceQueriesRepository } from '../../application/repositories/maintenance-read.repository';
import { ImplMaintenanceQueriesRepository } from '../implementation/maintenance/impl-maintenance-queries.repository';

export const repositories = [
  {
    provide: ProductCategoryRepository,
    useClass: ImplProductCategoryRepository,
  },
  {
    provide: ProductCategoryQueriesRepository,
    useClass: ImplProductCategoryRepository,
  },
  { provide: ProductRepository, useClass: ImplProductRepository },
  { provide: ProductQueriesRepository, useClass: ImplProductRepository },
  { provide: MAINTENANCE_REPOSITORY, useClass: PrismaMaintenanceRepository },
  {
    provide: MaintenanceQueriesRepository,
    useClass: ImplMaintenanceQueriesRepository,
  },
  { provide: AVAILABILITY_REPOSITORY, useClass: PrismaAvailabilityRepository },
  { provide: MeasurementUnitRepository, useClass: PrismaMeasurementUnitRepository },
  { provide: MeasurementUnitQueriesRepository, useClass: PrismaMeasurementUnitQueriesRepository },
];
