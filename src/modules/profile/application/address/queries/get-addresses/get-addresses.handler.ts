import { Pagination } from '@/shared/domain/value-object/pagination';
import { Address } from '@/modules/profile/domain/entities/address';
import { GetAddressesQuery } from './get-addresses.query';
import { PaginationParams } from '@/shared/domain/value-object/pagination-params';
import { AddressReadRepository } from '../../../repositories/address-read.repository';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

@QueryHandler(GetAddressesQuery)
export class GetAddressesHandler implements IQueryHandler<GetAddressesQuery> {
  constructor(private readonly repository: AddressReadRepository) {}
  async execute(
    query: GetAddressesQuery,
  ): Promise<Pagination<Address> | Address[]> {
    if (query.pagination_params) {
      const paginationParams = PaginationParams.create({
        ...query.pagination_params,
      });
      return await this.repository.getAll(paginationParams, query.filter);
    }
    return await this.repository.getAll(undefined, query.filter);
  }
}
