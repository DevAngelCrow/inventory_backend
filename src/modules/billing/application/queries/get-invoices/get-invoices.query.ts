import { PaginationParamsDto } from '@/shared/application/dtos/pagination.dto';

export class GetInvoicesQuery {
  constructor(
    public readonly pagination_params?: PaginationParamsDto,
    public readonly filter_reservation?: string,
    public readonly filter_customer?: string,
    public readonly filter_status?: string,
  ) {}
}
