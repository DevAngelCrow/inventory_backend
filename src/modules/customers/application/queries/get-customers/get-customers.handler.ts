import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCustomersQuery } from './get-customers.query';
import { CustomerQueriesRepository } from '@/modules/customers/application/repositories/customer-read.repository';
import { CustomerDto } from '@/modules/customers/application/dtos/customer.dto';
import { Pagination } from '@/shared/domain/value-object/pagination';
import { PaginationParams } from '@/shared/domain/value-object/pagination-params';

@QueryHandler(GetCustomersQuery)
export class GetCustomersHandler implements IQueryHandler<GetCustomersQuery> {
  constructor(private readonly repository: CustomerQueriesRepository) {}

  async execute(
    query: GetCustomersQuery,
  ): Promise<Pagination<CustomerDto> | CustomerDto[]> {
    if (query.pagination_params) {
      const paginationParams = PaginationParams.create({
        ...query.pagination_params,
      });
      return await this.repository.getAll(
        paginationParams,
        query.filter_name,
        query.filter_email,
        query.active,
      );
    }
    return await this.repository.getAll(
      undefined,
      query.filter_name,
      query.filter_email,
      query.active,
    );
  }
}
