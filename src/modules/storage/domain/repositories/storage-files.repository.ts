import { StorageFiles } from '../entities/storage-files';
import { StorageFilesContentFile } from '../value-objects/storage-files-value-object/storage-files-content-file';
import { StorageFilesPath } from '../value-objects/storage-files-value-object/storage-files-path';
import { Pagination } from '@/shared/domain/value-object/pagination';
import { PaginationParams } from '@/shared/domain/value-object/pagination-params';
import { StorageFileListDto } from '@/modules/storage/application/dtos/storage-file-list.dto';

export abstract class StorageFilesRepository {
  abstract upload<T>(
    storage_file_content: StorageFilesContentFile<T>,
    folder?: string,
  ): Promise<{
    content_file: StorageFilesContentFile<T>;
    path: StorageFilesPath;
  }>;
  abstract create<T>(storage_file: StorageFiles<T>): Promise<StorageFiles<T>>;
  abstract getAll(
    pagination_params?: PaginationParams,
    id_provider?: string,
  ): Promise<Pagination<StorageFileListDto> | StorageFileListDto[]>;
}
