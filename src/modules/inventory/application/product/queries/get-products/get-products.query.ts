import { PaginationParamsDto } from '@/shared/application/dtos/pagination.dto';

export class GetProductsQuery {
  constructor(
    public readonly pagination_params?: PaginationParamsDto,
    public readonly filter_name?: string,
    public readonly filter_sku?: string,
    public readonly filter_category?: string,
    public readonly active?: boolean,
  ) {}
}
