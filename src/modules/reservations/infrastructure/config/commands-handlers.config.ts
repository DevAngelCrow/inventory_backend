import { CreateReservationHandler } from '../../application/commands/create-reservation/create-reservation.handler';
import { UpdateReservationStatusHandler } from '../../application/commands/update-reservation-status/update-reservation-status.handler';
import { DeleteReservationHandler } from '../../application/commands/delete-reservation/delete-reservation.handler';

export const commandHandlerProviders = [
  CreateReservationHandler,
  UpdateReservationStatusHandler,
  DeleteReservationHandler,
];
