import { Pagination } from '@/shared/domain/value-object/pagination';
import { PaginationParams } from '@/shared/domain/value-object/pagination-params';
import { ProviderStorage } from '../../domain/entities/provider-storage';
import { ProviderStorageId } from '../../domain/value-objects/provider-storage-value-object/provider-storage-id';
import { ProviderStorageCode } from '../../domain/value-objects/provider-storage-value-object/provider-storage-code';

export abstract class ProviderStorageQueriesRepository {
  abstract getAll(
    pagination_params?: PaginationParams,
    filter?: string,
  ): Promise<Pagination<ProviderStorage> | ProviderStorage[]>;
  abstract getOneById(id: ProviderStorageId): Promise<ProviderStorage | null>;
  abstract getOneByCode(
    code: ProviderStorageCode,
  ): Promise<ProviderStorage | null>;
}
