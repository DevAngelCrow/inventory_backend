import { PaginationParamsDto } from '@/shared/application/dtos/pagination.dto';

export class GetCustomersQuery {
  constructor(
    public readonly pagination_params?: PaginationParamsDto,
    public readonly filter_name?: string,
    public readonly filter_email?: string,
    public readonly active?: boolean,
  ) {}
}
