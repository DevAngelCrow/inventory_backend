import { Pagination } from '@/shared/domain/value-object/pagination';
import { PaginationParams } from '@/shared/domain/value-object/pagination-params';
import { ProductCategoryDto } from '../dtos/product-category.dto';

export abstract class ProductCategoryQueriesRepository {
  abstract getAll(
    pagination_params?: PaginationParams,
    filter?: string,
    active?: boolean,
  ): Promise<Pagination<ProductCategoryDto> | ProductCategoryDto[]>;
  abstract findById(id: string): Promise<ProductCategoryDto | null>;
}
