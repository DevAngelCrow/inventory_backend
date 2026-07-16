import { StorageFiles } from '@/modules/storage/domain/entities/storage-files';
import { StorageFilesUploadFlowHandler } from '../../storage-files/commands/storage-files-upload-flow/storage-files-upload-flow.handler';
import { StorageFilesUploadFlowCommand } from '../../storage-files/commands/storage-files-upload-flow/storage-files-upload-flow.command';

interface FileUpload {
  originalname: string;
  size: number;
  mimetype: string;
}
export class StorageUploadService<T extends FileUpload> {
  constructor(
    private readonly storageUpload: StorageFilesUploadFlowHandler<T>,
  ) {}
  async run(
    storage_file_content: T,
    provider_storage_code: string,
    folder?: string,
  ): Promise<StorageFiles<T>> {
    const command = new StorageFilesUploadFlowCommand<T>(
      storage_file_content,
      provider_storage_code,
      folder,
    );
    return await this.storageUpload.execute(command);
  }
}
