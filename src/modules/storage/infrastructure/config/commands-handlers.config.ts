import { CreateProviderStorageHandler } from '../../application/provider-storage/commands/create-provider-storage/create-provider-storage.handler';
import { UpdateProviderStorageHandler } from '../../application/provider-storage/commands/update-provider-storage/update-provider-storage.handler';
import { DeleteProviderStorageHandler } from '../../application/provider-storage/commands/delete-provider-storage/delete-provider-storage.handler';
import { StorageFilesCreateHandler } from '../../application/storage-files/commands/storage-files-create/storage-files-create.handler';
import { StorageFilesUploadHandler } from '../../application/storage-files/commands/storage-files-upload/storage-files-upload.handler';
import { StorageFilesUploadFlowHandler } from '../../application/storage-files/commands/storage-files-upload-flow/storage-files-upload-flow.handler';

export const commandHandlerProviders = [
  CreateProviderStorageHandler,
  UpdateProviderStorageHandler,
  DeleteProviderStorageHandler,
  StorageFilesCreateHandler,
  StorageFilesUploadHandler,
  StorageFilesUploadFlowHandler,
];
