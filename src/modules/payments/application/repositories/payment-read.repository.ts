import { Pagination } from '@/shared/domain/value-object/pagination';
import { PaginationParams } from '@/shared/domain/value-object/pagination-params';
import { PaymentDto } from '../dtos/payment.dto';

export abstract class PaymentQueriesRepository {
  abstract getAll(
    pagination_params?: PaginationParams,
    filter_reservation?: string,
    filter_status?: string,
  ): Promise<Pagination<PaymentDto> | PaymentDto[]>;
  abstract findById(id: string): Promise<PaymentDto | null>;
  abstract getMethods(): Promise<any[]>;
}
