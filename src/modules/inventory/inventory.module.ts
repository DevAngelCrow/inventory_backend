import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { RouterModule } from '@nestjs/core';
import { ProductCategoryController } from './infrastructure/controllers/product-category.controller';
import { ProductController } from './infrastructure/controllers/product.controller';
import { ProductMaintenanceController } from './infrastructure/controllers/product-maintenance.controller';
import { repositories } from './infrastructure/config/repositories.config';
import { commandHandlerProviders } from './infrastructure/config/commands-handlers.config';
import { queryHandlerProviders } from './infrastructure/config/queries-handlers.config';
import { AvailabilityService } from './application/services/availability.service';

@Module({
  imports: [
    RouterModule.register([{ path: 'inventory', module: InventoryModule }]),
    CqrsModule,
  ],
  controllers: [
    ProductCategoryController,
    ProductController,
    ProductMaintenanceController,
  ],
  providers: [
    ...repositories,
    ...commandHandlerProviders,
    ...queryHandlerProviders,
    AvailabilityService,
  ],
  exports: [
    ...commandHandlerProviders,
    ...queryHandlerProviders,
    AvailabilityService,
  ],
})
export class InventoryModule {}
