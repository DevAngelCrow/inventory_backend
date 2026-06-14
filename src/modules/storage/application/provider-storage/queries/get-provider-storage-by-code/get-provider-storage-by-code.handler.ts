import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ProviderStorage } from '@/modules/storage/domain/entities/provider-storage';
import { GetProviderStorageByCodeQuery } from './get-provider-storage-by-code.query';
import { ProviderStorageCode } from '@/modules/storage/domain/value-objects/provider-storage-value-object/provider-storage-code';
import { ProviderStorageQueriesRepository } from '../../../repositories/provider-storage-read.repository';
import { NotFoundException } from '@/shared/domain/exceptions/not-found.exception';

@QueryHandler(GetProviderStorageByCodeQuery)
export class GetProviderStorageByCodeHandler implements IQueryHandler<GetProviderStorageByCodeQuery> {
  constructor(private readonly repository: ProviderStorageQueriesRepository) {}

  async execute(
    query: GetProviderStorageByCodeQuery,
  ): Promise<ProviderStorage> {
    const code = new ProviderStorageCode(query.code);
    const providerStorage = await this.repository.getOneByCode(code);

    if (!providerStorage) {
      throw new NotFoundException(
        'Provider storage not found',
        code.value().toString(),
      );
    }

    return providerStorage;
  }
}
