import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { StorageFilesRepository } from '@/modules/storage/domain/repositories/storage-files.repository';
import { StorageFilesContentFile } from '@/modules/storage/domain/value-objects/storage-files-value-object/storage-files-content-file';
import { StorageFilesPath } from '@/modules/storage/domain/value-objects/storage-files-value-object/storage-files-path';
import { StorageFilesUploadCommand } from './storage-files-upload.command';

@CommandHandler(StorageFilesUploadCommand)
export class StorageFilesUploadHandler<T> implements ICommandHandler<
  StorageFilesUploadCommand<T>
> {
  constructor(
    private readonly storageFilesRepository: StorageFilesRepository,
  ) {}
  async execute(command: StorageFilesUploadCommand<T>): Promise<{
    content_file: StorageFilesContentFile<T>;
    path: StorageFilesPath;
  }> {
    const storageFileUpload = new StorageFilesContentFile<T>(
      command.storage_file_content,
    );
    return await this.storageFilesRepository.upload<T>(storageFileUpload);
  }
}
