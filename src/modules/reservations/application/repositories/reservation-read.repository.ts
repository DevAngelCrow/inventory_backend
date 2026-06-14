import { Pagination } from '@/shared/domain/value-object/pagination';
import { PaginationParams } from '@/shared/domain/value-object/pagination-params';
import { ReservationDto } from '../dtos/reservation.dto';

export abstract class ReservationQueriesRepository {
  abstract getAll(
    pagination_params?: PaginationParams,
    filter_customer?: string,
    filter_status?: string,
    filter_date_start?: Date,
    filter_date_end?: Date,
  ): Promise<Pagination<ReservationDto> | ReservationDto[]>;
  abstract findById(id: string): Promise<ReservationDto | null>;
}
