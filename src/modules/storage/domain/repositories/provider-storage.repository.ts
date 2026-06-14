import { PaginationParams } from '@/shared/domain/value-object/pagination-params';
import { ProviderStorage } from '../entities/provider-storage';
import { Pagination } from '@/shared/domain/value-object/pagination';
import { ProviderStorageId } from '../value-objects/provider-storage-value-object/provider-storage-id';
import { ProviderStorageCode } from '../value-objects/provider-storage-value-object/provider-storage-code';

export abstract class ProviderStorageRepository {
  abstract create(provider_storage: ProviderStorage): Promise<void>;
  abstract update(provider_storage: ProviderStorage): Promise<void>;
  abstract getAll(
    pagination_params?: PaginationParams,
    filter?: string,
  ): Promise<Pagination<ProviderStorage> | ProviderStorage[]>;
  abstract getOneById(id: ProviderStorageId): Promise<ProviderStorage | null>;
  abstract getOneByCode(
    code: ProviderStorageCode,
  ): Promise<ProviderStorage | null>;
  abstract toggleStatus(id: ProviderStorageId): Promise<ProviderStorage>;
}
