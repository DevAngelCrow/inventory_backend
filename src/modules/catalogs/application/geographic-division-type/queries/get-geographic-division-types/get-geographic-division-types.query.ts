import { PaginationParamsDto } from '@/shared/application/dtos/pagination.dto';

export class GetGeographicDivisionTypesQuery {
  constructor(
    public readonly pagination_params?: PaginationParamsDto,
    public readonly filter?: string,
    public readonly active?: boolean,
    public readonly id_country?: string,
  ) {}
}
