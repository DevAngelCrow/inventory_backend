import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetReservationQuery } from './get-reservation.query';
import { ReservationQueriesRepository } from '@/modules/reservations/application/repositories/reservation-read.repository';
import { ReservationDto } from '@/modules/reservations/application/dtos/reservation.dto';

@QueryHandler(GetReservationQuery)
export class GetReservationHandler implements IQueryHandler<GetReservationQuery> {
  constructor(private readonly repository: ReservationQueriesRepository) {}

  async execute(query: GetReservationQuery): Promise<ReservationDto | null> {
    return await this.repository.findById(query.id);
  }
}
