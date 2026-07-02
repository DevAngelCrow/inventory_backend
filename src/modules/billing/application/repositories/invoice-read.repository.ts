import { Pagination } from '@/shared/domain/value-object/pagination';
import { PaginationParams } from '@/shared/domain/value-object/pagination-params';
import { InvoiceDto } from '../dtos/invoice.dto';

export abstract class InvoiceQueriesRepository {
  abstract getAll(
    pagination_params?: PaginationParams,
    filter_reservation?: string,
    filter_customer?: string,
    filter_status?: string,
  ): Promise<Pagination<InvoiceDto> | InvoiceDto[]>;
  abstract findById(id: string): Promise<InvoiceDto | null>;
}
