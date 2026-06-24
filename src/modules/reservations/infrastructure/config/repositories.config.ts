import { ReservationRepository } from '../../domain/repositories/reservation-repository';
import { ReservationQueriesRepository } from '../../application/repositories/reservation-read.repository';
import { ImplReservationRepository } from '../implementation/reservation/impl-reservation.repository';

export const repositories = [
  { provide: ReservationRepository, useClass: ImplReservationRepository },
  {
    provide: ReservationQueriesRepository,
    useClass: ImplReservationRepository,
  },
];
