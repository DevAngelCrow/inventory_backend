import { PaginationParamsDto } from '@/shared/application/dtos/pagination.dto';

export class GetMaritalStatusesQuery {
  constructor(
    public readonly pagination_params?: PaginationParamsDto,
    public readonly filter?: string,
  ) {}
}
