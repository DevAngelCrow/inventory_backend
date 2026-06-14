import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ProviderStorage } from '@/modules/storage/domain/entities/provider-storage';
import { GetProviderStorageQuery } from './get-provider-storage.query';
import { ProviderStorageId } from '@/modules/storage/domain/value-objects/provider-storage-value-object/provider-storage-id';
import { ProviderStorageQueriesRepository } from '../../../repositories/provider-storage-read.repository';
import { NotFoundException } from '@/shared/domain/exceptions/not-found.exception';

@QueryHandler(GetProviderStorageQuery)
export class GetProviderStorageHandler implements IQueryHandler<GetProviderStorageQuery> {
  constructor(private readonly repository: ProviderStorageQueriesRepository) {}

  async execute(query: GetProviderStorageQuery): Promise<ProviderStorage> {
    const id = new ProviderStorageId(query.id);
    const providerStorage = await this.repository.getOneById(id);

    if (!providerStorage) {
      throw new NotFoundException(
        'Provider storage not found',
        id.value().toString(),
      );
    }

    return providerStorage;
  }
}
