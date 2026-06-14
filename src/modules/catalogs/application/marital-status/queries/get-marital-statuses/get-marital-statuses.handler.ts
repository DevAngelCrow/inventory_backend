import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Pagination } from '@/shared/domain/value-object/pagination';
import { GetMaritalStatusesQuery } from './get-marital-statuses.query';
import { PaginationParams } from '@/shared/domain/value-object/pagination-params';
import { MaritalStatusQueriesRepository } from '../../../repositories/marital-status-read.repository';
import { MaritalStatusDto } from '../../../dtos/marital-status.dto';

@QueryHandler(GetMaritalStatusesQuery)
export class GetMaritalStatusesHandler implements IQueryHandler<GetMaritalStatusesQuery> {
  constructor(private readonly repository: MaritalStatusQueriesRepository) {}
  async execute(
    query: GetMaritalStatusesQuery,
  ): Promise<Pagination<MaritalStatusDto> | MaritalStatusDto[]> {
    if (query.pagination_params) {
      const paginationParams = PaginationParams.create({
        ...query.pagination_params,
      });
      return await this.repository.getAll(paginationParams, query.filter);
    }
    return await this.repository.getAll(undefined, query.filter);
  }
}
