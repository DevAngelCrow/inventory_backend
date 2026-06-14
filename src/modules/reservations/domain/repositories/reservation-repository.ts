import { Reservation } from '../entities/reservation';
import { ReservationId } from '../value-objects/reservation-id';
import { ReservationStatusType } from '../value-objects/reservation-status';

export abstract class ReservationRepository {
  abstract create(reservation: Reservation): Promise<void>;
  abstract updateStatus(id: ReservationId, status: ReservationStatusType): Promise<Reservation>;
  abstract delete(id: ReservationId): Promise<void>;
}
