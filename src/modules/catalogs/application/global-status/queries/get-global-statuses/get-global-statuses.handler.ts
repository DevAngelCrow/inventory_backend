import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Pagination } from '@/shared/domain/value-object/pagination';
import { GetGlobalStatusesQuery } from './get-global-statuses.query';
import { PaginationParams } from '@/shared/domain/value-object/pagination-params';
import { GlobalStatusQueriesRepository } from '../../../repositories/global-status-read.repository';
import { GlobalStatusDto } from '../../../dtos/global-status.dto';

@QueryHandler(GetGlobalStatusesQuery)
export class GetGlobalStatusesHandler implements IQueryHandler<GetGlobalStatusesQuery> {
  constructor(private readonly repository: GlobalStatusQueriesRepository) {}
  async execute(
    query: GetGlobalStatusesQuery,
  ): Promise<Pagination<GlobalStatusDto> | GlobalStatusDto[]> {
    if (query.pagination_params) {
      const paginationParams = PaginationParams.create({
        ...query.pagination_params,
      });
      return await this.repository.getAll(
        paginationParams,
        query.filter,
        query.active,
        query.id_category,
        query.category_code,
      );
    }
    return await this.repository.getAll(
      undefined,
      query.filter,
      query.active,
      query.id_category,
      query.category_code,
    );
  }
}
