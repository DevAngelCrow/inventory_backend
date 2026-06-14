import { Pagination } from '@/shared/domain/value-object/pagination';
import { PaginationParams } from '@/shared/domain/value-object/pagination-params';
import { ProductDto } from '../dtos/product.dto';

export abstract class ProductQueriesRepository {
  abstract getAll(
    pagination_params?: PaginationParams,
    filter_name?: string,
    filter_sku?: string,
    filter_category?: string,
    active?: boolean,
  ): Promise<Pagination<ProductDto> | ProductDto[]>;
  abstract findById(id: string): Promise<ProductDto | null>;
  abstract findBySku(sku: string): Promise<ProductDto | null>;
}
