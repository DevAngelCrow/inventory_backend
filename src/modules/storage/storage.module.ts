import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { ProviderStorageController } from './infrastructure/controllers/provider-storage.controller';

import { StorageFilesController } from './infrastructure/controllers/storage-files.controller';

import { repositories } from './infrastructure/config/repositories.config';
import { serviceProviders } from './infrastructure/config/services.config';
import { CqrsModule } from '@nestjs/cqrs';
import { commandHandlerProviders } from './infrastructure/config/commands-handlers.config';
import { queryHandlerProviders } from './infrastructure/config/queries-handlers.config';
import { StorageFileReaderPort } from './domain/ports/storage-file-reader.port';
import { LocalStorageBackend } from './infrastructure/backends/local-storage.backend';
import { S3StorageBackend } from './infrastructure/backends/s3-storage.backend';
import { StorageBackendRegistry } from './infrastructure/backends/storage-backend.registry';

@Module({
  imports: [
    RouterModule.register([{ path: 'storage', module: StorageModule }]),
    CqrsModule,
  ],
  controllers: [ProviderStorageController, StorageFilesController],
  providers: [
    LocalStorageBackend,
    S3StorageBackend,
    StorageBackendRegistry,
    ...repositories,
    ...serviceProviders,
    ...commandHandlerProviders,
    ...queryHandlerProviders,
  ],
  exports: [
    ...serviceProviders,
    ...commandHandlerProviders,
    ...queryHandlerProviders,
    StorageFileReaderPort,
  ],
})
export class StorageModule {}
