import { PaginationParamsDto } from '@/shared/application/dtos/pagination.dto';

export class GetReservationsQuery {
  constructor(
    public readonly pagination_params?: PaginationParamsDto,
    public readonly filter_customer?: string,
    public readonly filter_status?: string,
    public readonly filter_date_start?: Date,
    public readonly filter_date_end?: Date,
  ) {}
}
