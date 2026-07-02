import { ReservationAggregate as Reservation } from '../aggregates/reservation.aggregate';
import { ReservationId } from '../value-objects/reservation-id';
import { ReservationStatusType } from '../value-objects/reservation-status';

export abstract class ReservationRepository {
  abstract create(reservation: Reservation): Promise<void>;
  abstract updateStatus(
    id: ReservationId,
    status: ReservationStatusType,
    deliveryDatetime?: Date,
    pickupDatetime?: Date,
  ): Promise<Reservation>;
  abstract updateBalance(
    id: ReservationId,
    balance_due_delta: number,
    deposit_amount_delta: number,
  ): Promise<void>;
  abstract update(reservation: Reservation): Promise<void>;
  abstract delete(id: ReservationId): Promise<void>;
}
