import { Pagination } from '@/shared/domain/value-object/pagination';
import { PaginationParams } from '@/shared/domain/value-object/pagination-params';
import { CustomerDto } from '../dtos/customer.dto';

export abstract class CustomerQueriesRepository {
  abstract getAll(
    pagination_params?: PaginationParams,
    filter_name?: string,
    filter_email?: string,
    active?: boolean,
  ): Promise<Pagination<CustomerDto> | CustomerDto[]>;
  abstract findById(id: string): Promise<CustomerDto | null>;
  abstract findByEmail(email: string): Promise<CustomerDto | null>;
}
