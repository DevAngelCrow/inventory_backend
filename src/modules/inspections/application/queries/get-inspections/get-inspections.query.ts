import { PaginationParamsDto } from '@/shared/application/dtos/pagination.dto';

export class GetInspectionsQuery {
  constructor(
    public readonly pagination_params?: PaginationParamsDto,
    public readonly filter_reservation?: string,
    public readonly filter_status?: string,
  ) {}
}
