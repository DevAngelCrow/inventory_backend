import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetStorageFilesQuery } from './get-storage-files.query';
import { PaginationParams } from '@/shared/domain/value-object/pagination-params';
import { StorageFilesRepository } from '@/modules/storage/domain/repositories/storage-files.repository';
import { Pagination } from '@/shared/domain/value-object/pagination';
import { StorageFileListDto } from '@/modules/storage/application/dtos/storage-file-list.dto';

@QueryHandler(GetStorageFilesQuery)
export class GetStorageFilesHandler implements IQueryHandler<GetStorageFilesQuery> {
  constructor(private readonly repository: StorageFilesRepository) {}

  async execute(
    query: GetStorageFilesQuery,
  ): Promise<Pagination<StorageFileListDto> | StorageFileListDto[]> {
    if (query.pagination_params) {
      const paginationParams = PaginationParams.create({
        ...query.pagination_params,
      });
      return await this.repository.getAll(paginationParams, query.id_provider);
    }
    return await this.repository.getAll(undefined, query.id_provider);
  }
}
