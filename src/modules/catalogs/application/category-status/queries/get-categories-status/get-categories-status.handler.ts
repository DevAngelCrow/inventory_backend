import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Pagination } from '@/shared/domain/value-object/pagination';
import { GetCategoriesStatusQuery } from './get-categories-status.query';
import { PaginationParams } from '@/shared/domain/value-object/pagination-params';
import { CategoryStatusQueriesRepository } from '../../../repositories/category-status-read.repository';
import { CategoryStatusDto } from '../../../dtos/category-status.dto';

@QueryHandler(GetCategoriesStatusQuery)
export class GetCategoriesStatusHandler implements IQueryHandler<GetCategoriesStatusQuery> {
  constructor(private readonly repository: CategoryStatusQueriesRepository) {}
  async execute(
    query: GetCategoriesStatusQuery,
  ): Promise<Pagination<CategoryStatusDto> | CategoryStatusDto[]> {
    if (query.pagination_params) {
      const paginationParams = PaginationParams.create({
        ...query.pagination_params,
      });
      return await this.repository.getAll(
        paginationParams,
        query.filter,
        query.active,
      );
    }
    return await this.repository.getAll(undefined, query.filter, query.active);
  }
}
