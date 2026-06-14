import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Pagination } from '@/shared/domain/value-object/pagination';
import { GetCategoryPermissionsQuery } from './get-category-permissions.query';
import { PaginationParams } from '@/shared/domain/value-object/pagination-params';
import { CategoryPermissionsDto } from '../../../dtos/category-permissions.dto';
import { CategoryPermissionsReadRepository } from '../../../repositories/category-permissions-read.repository';

@QueryHandler(GetCategoryPermissionsQuery)
export class GetCategoryPermissionsHandler implements IQueryHandler<GetCategoryPermissionsQuery> {
  constructor(private readonly repository: CategoryPermissionsReadRepository) {}
  async execute(
    query: GetCategoryPermissionsQuery,
  ): Promise<Pagination<CategoryPermissionsDto> | CategoryPermissionsDto[]> {
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
