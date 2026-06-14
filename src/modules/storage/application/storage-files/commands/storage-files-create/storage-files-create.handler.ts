import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { StorageFilesRepository } from '@/modules/storage/domain/repositories/storage-files.repository';
import { StorageFilesCreateCommand } from './storage-files-create.command';
import { StorageFiles } from '@/modules/storage/domain/entities/storage-files';
import { StorageFilesContentFile } from '@/modules/storage/domain/value-objects/storage-files-value-object/storage-files-content-file';

@CommandHandler(StorageFilesCreateCommand)
export class StorageFilesCreateHandler implements ICommandHandler<
  StorageFilesCreateCommand<unknown>
> {
  constructor(
    private readonly storageFilesRepository: StorageFilesRepository,
  ) {}
  async execute<T>(
    command: StorageFilesCreateCommand<T>,
  ): Promise<StorageFiles<T>> {
    const pathFile = await this.storageFilesRepository.upload<T>(
      new StorageFilesContentFile<T>(command.storage_file_dto.content_file),
    );
    const storageFileCreate = StorageFiles.create<T>({
      filename: command.storage_file_dto.filename,
      id_provider: command.storage_file_dto.id_provider,
      size: command.storage_file_dto.size,
      mime_type: command.storage_file_dto.mime_type,
      active: command.storage_file_dto.active,
      content_file: command.storage_file_dto.content_file,
      path: pathFile.path.value(),
    });
    return await this.storageFilesRepository.create<T>(storageFileCreate);
  }
}
