import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetProductsQuery } from './get-products.query';
import { ProductQueriesRepository } from '@/modules/inventory/application/repositories/product-read.repository';
import { ProductDto } from '@/modules/inventory/application/dtos/product.dto';
import { Pagination } from '@/shared/domain/value-object/pagination';
import { PaginationParams } from '@/shared/domain/value-object/pagination-params';

@QueryHandler(GetProductsQuery)
export class GetProductsHandler implements IQueryHandler<GetProductsQuery> {
  constructor(private readonly repository: ProductQueriesRepository) {}

  async execute(
    query: GetProductsQuery,
  ): Promise<Pagination<ProductDto> | ProductDto[]> {
    if (query.pagination_params) {
      const paginationParams = PaginationParams.create({
        ...query.pagination_params,
      });
      return await this.repository.getAll(
        paginationParams,
        query.filter_name,
        query.filter_sku,
        query.filter_category,
        query.active,
      );
    }
    return await this.repository.getAll(
      undefined,
      query.filter_name,
      query.filter_sku,
      query.filter_category,
      query.active,
    );
  }
}
