import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Pagination } from '@/shared/domain/value-object/pagination';
import { ProviderStorage } from '@/modules/storage/domain/entities/provider-storage';
import { GetProviderStoragesQuery } from './get-provider-storages.query';
import { PaginationParams } from '@/shared/domain/value-object/pagination-params';
import { ProviderStorageQueriesRepository } from '../../../repositories/provider-storage-read.repository';

@QueryHandler(GetProviderStoragesQuery)
export class GetProviderStoragesHandler implements IQueryHandler<GetProviderStoragesQuery> {
  constructor(private readonly repository: ProviderStorageQueriesRepository) {}

  async execute(
    query: GetProviderStoragesQuery,
  ): Promise<Pagination<ProviderStorage> | ProviderStorage[]> {
    if (query.pagination_params) {
      const paginationParams = PaginationParams.create({
        ...query.pagination_params,
      });
      return await this.repository.getAll(paginationParams, query.filter);
    }
    return await this.repository.getAll(undefined, query.filter);
  }
}
