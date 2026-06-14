import { PaginationParamsDto } from '@/shared/application/dtos/pagination.dto';

export class GetPermissionsQuery {
  constructor(
    public readonly pagination_params?: PaginationParamsDto,
    public readonly filter?: string,
    public readonly active?: boolean,
    public readonly category_permission_id?: string,
  ) {}
}
