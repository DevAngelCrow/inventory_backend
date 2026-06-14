import { PaginationParamsDto } from '@/shared/application/dtos/pagination.dto';

export class GetGlobalStatusesQuery {
  constructor(
    public readonly pagination_params?: PaginationParamsDto,
    public readonly filter?: string,
    public readonly active?: boolean,
    public readonly id_category?: string,
    public readonly category_code?: string,
  ) {}
}
