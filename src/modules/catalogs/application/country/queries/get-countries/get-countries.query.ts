import { PaginationParamsDto } from '@/shared/application/dtos/pagination.dto';

export class GetCountriesQuery {
  constructor(
    public readonly pagination_params?: PaginationParamsDto,
    public readonly filter?: string,
    public readonly active?: boolean,
  ) {}
}
