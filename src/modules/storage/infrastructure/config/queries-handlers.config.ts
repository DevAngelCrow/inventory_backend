import { GetProviderStoragesHandler } from '../../application/provider-storage/queries/get-provider-storages/get-provider-storages.handler';
import { GetProviderStorageHandler } from '../../application/provider-storage/queries/get-provider-storage/get-provider-storage.handler';
import { GetProviderStorageByCodeHandler } from '../../application/provider-storage/queries/get-provider-storage-by-code/get-provider-storage-by-code.handler';
import { GetStorageFilesHandler } from '../../application/storage-files/queries/get-storage-files/get-storage-files.handler';

export const queryHandlerProviders = [
  GetProviderStoragesHandler,
  GetProviderStorageHandler,
  GetProviderStorageByCodeHandler,
  GetStorageFilesHandler,
];
