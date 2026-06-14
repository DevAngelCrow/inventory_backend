import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetProductCategoryQuery } from './get-product-category.query';
import { ProductCategoryQueriesRepository } from '@/modules/inventory/application/repositories/product-category-read.repository';
import { ProductCategoryDto } from '@/modules/inventory/application/dtos/product-category.dto';

@QueryHandler(GetProductCategoryQuery)
export class GetProductCategoryHandler
  implements IQueryHandler<GetProductCategoryQuery>
{
  constructor(
    private readonly repository: ProductCategoryQueriesRepository,
  ) {}

  async execute(query: GetProductCategoryQuery): Promise<ProductCategoryDto | null> {
    return await this.repository.findById(query.id);
  }
}
