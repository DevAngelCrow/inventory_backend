import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { CategoryPermissionsController } from './infrastructure/controllers/category-permissions.controller';
import { RolController } from './infrastructure/controllers/rol.controller';
import { PermissionsController } from './infrastructure/controllers/permissions.controller';
import { RouteController } from './infrastructure/controllers/route.controller';
import { repositories } from './infrastructure/config/repositories.config';
import { serviceProviders } from './infrastructure/config/services.config';
import { MenuController } from './infrastructure/controllers/menu.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { commandHandlerProviders } from './infrastructure/config/commands-handlers.config';
import { queryHandlerProviders } from './infrastructure/config/queries-handlers.config';
import { UserRolController } from './infrastructure/controllers/user-rol.controller';
import { StorageModule } from '@/modules/storage/storage.module';

@Module({
  imports: [
    RouterModule.register([{ path: 'security', module: SecurityModule }]),
    CqrsModule,
    StorageModule,
  ],
  controllers: [
    CategoryPermissionsController,
    PermissionsController,
    RolController,
    RouteController,
    MenuController,
    UserRolController,
  ],
  providers: [
    ...serviceProviders,
    ...repositories,
    ...commandHandlerProviders,
    ...queryHandlerProviders,
  ],
  exports: [
    ...serviceProviders,
    ...commandHandlerProviders,
    ...queryHandlerProviders,
  ],
})
export class SecurityModule {}
