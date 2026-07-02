import { Module } from '@nestjs/common';
import { PersonController } from './infrastructure/controllers/person.controller';

import { DocumentTypeController } from './infrastructure/controllers/document-type.controller';
import { DocumentController } from './infrastructure/controllers/document.controller';
import { AddressController } from './infrastructure/controllers/address.controller';
import { repositories } from './infrastructure/config/repositories.config';
import { serviceProviders } from './infrastructure/config/services.config';
import { RouterModule } from '@nestjs/core';
import { CqrsModule } from '@nestjs/cqrs';
import { EventDispatcherModule } from '@/shared/infrastructure/event-dispatcher/event-dispatcher.module';
import { StorageModule } from '@/modules/storage/storage.module';
import { commandHandlerProviders } from './infrastructure/config/commands-handlers.config';
import { queryHandlerProviders } from './infrastructure/config/queries-handlers.config';

@Module({
  imports: [
    RouterModule.register([{ path: 'profile', module: ProfileModule }]),
    CqrsModule,
    EventDispatcherModule,
    StorageModule,
  ],
  controllers: [
    PersonController,
    DocumentTypeController,
    DocumentController,
    AddressController,
  ],
  providers: [
    ...repositories,
    ...serviceProviders,
    ...commandHandlerProviders,
    ...queryHandlerProviders,
  ],
  exports: [
    ...serviceProviders,
    ...commandHandlerProviders,
    ...queryHandlerProviders,
  ],
})
export class ProfileModule {}
