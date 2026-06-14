import { Abstract, Type } from '@nestjs/common';
import { StorageUploadService } from '../../application/services/storage/storage-upload.service';
import { registerService } from '@/shared/infrastructure/factories/register-service.factory';
import { StorageFilesUploadFlowHandler } from '../../application/storage-files/commands/storage-files-upload-flow/storage-files-upload-flow.handler';

export const services: Array<{
  service: Type<unknown>;
  deps: Array<Type<unknown> | Abstract<unknown>>;
}> = [
  {
    service: StorageUploadService,
    deps: [StorageFilesUploadFlowHandler],
  },
];

export const serviceProviders = services.map((uc) => {
  return registerService(uc.service, uc.deps);
});
