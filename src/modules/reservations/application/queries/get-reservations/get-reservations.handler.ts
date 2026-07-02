import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetReservationsQuery } from './get-reservations.query';
import { ReservationQueriesRepository } from '@/modules/reservations/application/repositories/reservation-read.repository';
import { ReservationDto } from '@/modules/reservations/application/dtos/reservation.dto';
import { Pagination } from '@/shared/domain/value-object/pagination';
import { PaginationParams } from '@/shared/domain/value-object/pagination-params';

@QueryHandler(GetReservationsQuery)
export class GetReservationsHandler implements IQueryHandler<GetReservationsQuery> {
  constructor(private readonly repository: ReservationQueriesRepository) {}

  async execute(
    query: GetReservationsQuery,
  ): Promise<Pagination<ReservationDto> | ReservationDto[]> {
    if (query.pagination_params) {
      const paginationParams = PaginationParams.create({
        ...query.pagination_params,
      });
      return await this.repository.getAll(
        paginationParams,
        query.filter_customer,
        query.filter_status,
        query.filter_date_start,
        query.filter_date_end,
      );
    }
    return await this.repository.getAll(
      undefined,
      query.filter_customer,
      query.filter_status,
      query.filter_date_start,
      query.filter_date_end,
    );
  }
}
