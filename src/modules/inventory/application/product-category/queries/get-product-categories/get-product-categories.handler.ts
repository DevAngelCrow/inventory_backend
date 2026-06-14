import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetProductCategoriesQuery } from './get-product-categories.query';
import { ProductCategoryQueriesRepository } from '@/modules/inventory/application/repositories/product-category-read.repository';
import { ProductCategoryDto } from '@/modules/inventory/application/dtos/product-category.dto';
import { Pagination } from '@/shared/domain/value-object/pagination';
import { PaginationParams } from '@/shared/domain/value-object/pagination-params';

@QueryHandler(GetProductCategoriesQuery)
export class GetProductCategoriesHandler
  implements IQueryHandler<GetProductCategoriesQuery>
{
  constructor(
    private readonly repository: ProductCategoryQueriesRepository,
  ) {}

  async execute(
    query: GetProductCategoriesQuery,
  ): Promise<Pagination<ProductCategoryDto> | ProductCategoryDto[]> {
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
