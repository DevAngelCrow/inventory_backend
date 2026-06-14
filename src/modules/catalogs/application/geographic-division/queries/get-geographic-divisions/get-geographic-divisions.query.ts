import { PaginationParamsDto } from '@/shared/application/dtos/pagination.dto';

export class GetGeographicDivisionsQuery {
  constructor(
    public readonly pagination_params?: PaginationParamsDto,
    public readonly filter?: string,
    public readonly active?: boolean,
    public readonly id_country?: string,
    public readonly id_parent?: string,
    public readonly id_type?: string,
  ) {}
}
