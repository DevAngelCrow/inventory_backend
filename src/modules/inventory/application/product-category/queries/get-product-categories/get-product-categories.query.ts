import { PaginationParamsDto } from '@/shared/application/dtos/pagination.dto';

export class GetProductCategoriesQuery {
  constructor(
    public readonly pagination_params?: PaginationParamsDto,
    public readonly filter?: string,
    public readonly active?: boolean,
  ) {}
}
