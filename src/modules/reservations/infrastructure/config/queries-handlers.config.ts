import { GetReservationsHandler } from '../../application/queries/get-reservations/get-reservations.handler';
import { GetReservationHandler } from '../../application/queries/get-reservation/get-reservation.handler';

export const queryHandlerProviders = [
  GetReservationsHandler,
  GetReservationHandler,
];
