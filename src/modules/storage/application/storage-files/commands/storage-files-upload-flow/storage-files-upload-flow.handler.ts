import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { storageFilesUploadedTotal } from '@/shared/infrastructure/health/business-metrics';
import { StorageFiles } from '@/modules/storage/domain/entities/storage-files';
import { ProviderStorageRepository } from '@/modules/storage/domain/repositories/provider-storage.repository';
import { StorageFilesRepository } from '@/modules/storage/domain/repositories/storage-files.repository';
import { StorageFilesContentFile } from '@/modules/storage/domain/value-objects/storage-files-value-object/storage-files-content-file';
import { StorageFilesIdProvider } from '@/modules/storage/domain/value-objects/storage-files-value-object/storage-files-id-provider';
import { NotFoundException } from '@/shared/domain/exceptions/not-found.exception';
import { StorageFilesDto } from '../../../dtos/storage-files.dto';
import { StorageFilesUploadFlowCommand } from './storage-files-upload-flow.command';
import { ProviderStorageCode } from '@/modules/storage/domain/value-objects/provider-storage-value-object/provider-storage-code';
import { BadRequestException } from '@/shared/domain/exceptions/bad-request.exception';
import { ALLOWED_MIME_TYPES } from '@/modules/storage/infrastructure/config/multer-file-filter.config';

interface FileUpload {
  originalname: string;
  size: number;
  mimetype: string;
}
@CommandHandler(StorageFilesUploadFlowCommand)
export class StorageFilesUploadFlowHandler<
  T extends FileUpload,
> implements ICommandHandler<StorageFilesUploadFlowCommand<T>> {
  constructor(
    private readonly storageFilesRepository: StorageFilesRepository,
    private readonly providerStorageReposotiry: ProviderStorageRepository,
  ) {}
  async execute(
    command: StorageFilesUploadFlowCommand<T>,
  ): Promise<StorageFiles<T>> {
    const file = command.storage_file_content;
    if (!file || !ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      throw new BadRequestException(
        `File type '${file?.mimetype ?? 'unknown'}' is not allowed. Allowed types: ${ALLOWED_MIME_TYPES.join(', ')}`,
      );
    }
    const storageFileUpload = new StorageFilesContentFile<T>(
      command.storage_file_content,
    );
    const providerStorage = await this.providerStorageReposotiry.getOneByCode(
      new ProviderStorageCode(command.provider_storage_code),
    );
    if (!providerStorage) {
      throw new NotFoundException(
        'ProviderStorage',
        command.provider_storage_code,
      );
    }
    const providerId = providerStorage.getId();
    if (!providerId?.value()) {
      throw new Error(`ProviderStorage id is undefined`);
    }
    const idProviderStorage = new StorageFilesIdProvider(providerId.value());
    const storageContentFile =
      await this.storageFilesRepository.upload<T>(storageFileUpload, command.folder);
    const storageFileDto = new StorageFilesDto<T>(
      storageContentFile.content_file.value().originalname,
      idProviderStorage.value(),
      storageContentFile.content_file.value().size,
      storageContentFile.content_file.value().mimetype,
      true,
      command.storage_file_content,
      storageContentFile.path.value(),
    );
    const storageFileEntity = StorageFiles.create<T>({ ...storageFileDto });
    const result =
      await this.storageFilesRepository.create<T>(storageFileEntity);
    storageFilesUploadedTotal.inc({ provider: command.provider_storage_code });
    return result;
  }
}
