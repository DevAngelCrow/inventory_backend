import { PaginationParamsDto } from '@/shared/application/dtos/pagination.dto';

export class GetPaymentsQuery {
  constructor(
    public readonly pagination_params?: PaginationParamsDto,
    public readonly filter_reservation?: string,
    public readonly filter_status?: string,
    public readonly id_reservation?: string,
  ) {}
}
