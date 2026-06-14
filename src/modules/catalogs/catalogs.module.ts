import { Module } from '@nestjs/common';
import { CountryController } from './infrastructure/controllers/country.controller';
import { RouterModule } from '@nestjs/core';
import { GlobalStatusController } from './infrastructure/controllers/global-status.controller';
import { MaritalStatusController } from './infrastructure/controllers/marital-status.controller';
import { repositories } from './infrastructure/config/repositories.config';
import { commandHandlerProviders } from './infrastructure/config/commands-handlers.config';
import { CqrsModule } from '@nestjs/cqrs';
import { queryHandlerProviders } from './infrastructure/config/queries-handlers.config';
import { GenderController } from './infrastructure/controllers/gender.controller';
import { CategoryStatusController } from './infrastructure/controllers/category-status.controller';
import { GeographicDivisionTypeController } from './infrastructure/controllers/geographic-division-type.controller';
import { GeographicDivisionController } from './infrastructure/controllers/geographic-division.controller';
import { serviceProviders } from './infrastructure/config/services.config';

@Module({
  imports: [
    RouterModule.register([{ path: 'catalogs', module: CatalogsModule }]),
    CqrsModule,
  ],
  controllers: [
    CountryController,
    GlobalStatusController,
    MaritalStatusController,
    GenderController,
    CategoryStatusController,
    GeographicDivisionTypeController,
    GeographicDivisionController,
  ],
  providers: [
    ...repositories,
    ...commandHandlerProviders,
    ...queryHandlerProviders,
    ...serviceProviders,
  ],
  exports: [
    ...commandHandlerProviders,
    ...queryHandlerProviders,
    ...serviceProviders,
  ],
})
export class CatalogsModule {}
