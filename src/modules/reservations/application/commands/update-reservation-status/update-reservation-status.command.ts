import { ReservationStatusType } from '@/modules/reservations/domain/value-objects/reservation-status';

export class UpdateReservationStatusCommand {
  constructor(
    public readonly id: string,
    public readonly status: ReservationStatusType,
  ) {}
}
