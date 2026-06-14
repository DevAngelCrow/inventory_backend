import { PaginationParamsDto } from '@/shared/application/dtos/pagination.dto';

export class GetCategoryPermissionsQuery {
  constructor(
    public readonly pagination_params?: PaginationParamsDto,
    public readonly filter?: string,
    public readonly active?: boolean,
  ) {}
}
