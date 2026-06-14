import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetProductQuery } from './get-product.query';
import { ProductQueriesRepository } from '@/modules/inventory/application/repositories/product-read.repository';
import { ProductDto } from '@/modules/inventory/application/dtos/product.dto';

@QueryHandler(GetProductQuery)
export class GetProductHandler implements IQueryHandler<GetProductQuery> {
  constructor(private readonly repository: ProductQueriesRepository) {}

  async execute(query: GetProductQuery): Promise<ProductDto | null> {
    return await this.repository.findById(query.id);
  }
}
