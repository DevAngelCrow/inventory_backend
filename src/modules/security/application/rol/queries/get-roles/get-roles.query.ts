import { PaginationParamsDto } from '@/shared/application/dtos/pagination.dto';

export class GetRolesQuery {
  constructor(
    public readonly pagination_params?: PaginationParamsDto,
    public readonly filter?: string,
    public readonly id_status?: string,
  ) {}
}
