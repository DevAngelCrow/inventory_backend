import { CreateReservationHandler } from '../../application/commands/create-reservation/create-reservation.handler';
import { UpdateReservationStatusHandler } from '../../application/commands/update-reservation-status/update-reservation-status.handler';
import { DeleteReservationHandler } from '../../application/commands/delete-reservation/delete-reservation.handler';
import { UpdateReservationHandler } from '../../application/commands/update-reservation/update-reservation.handler';
import { UpdateReservationBalanceHandler } from '../../application/commands/update-reservation-balance/update-reservation-balance.handler';

export const commandHandlerProviders = [
  CreateReservationHandler,
  UpdateReservationStatusHandler,
  DeleteReservationHandler,
  UpdateReservationHandler,
  UpdateReservationBalanceHandler,
];
