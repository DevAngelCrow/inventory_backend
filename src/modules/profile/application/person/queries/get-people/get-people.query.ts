import { PaginationParamsDto } from '@/shared/application/dtos/pagination.dto';

export class GetPeopleQuery {
  constructor(
    public readonly pagination_params?: PaginationParamsDto,
    public readonly filter?: string,
  ) {}
}
