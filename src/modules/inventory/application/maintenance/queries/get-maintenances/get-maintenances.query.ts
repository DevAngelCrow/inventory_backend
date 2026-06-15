import { PaginationParamsDto } from '@/shared/application/dtos/pagination.dto';

export class GetMaintenancesQuery {
  constructor(
    public readonly paginationParams: PaginationParamsDto,
    public readonly id_product?: string,
    public readonly resolved?: boolean,
  ) {}
}
