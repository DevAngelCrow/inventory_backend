import { InvalidValueObjectException } from '@/shared/domain/exceptions/invalid-value-object.exception';

export type ReservationStatusType = 'DRAFT' | 'CONFIRMED' | 'IN_TRANSIT' | 'DELIVERED' | 'PICKED_UP' | 'RETURNED' | 'INSPECTED' | 'COMPLETED' | 'CANCELLED';

export class ReservationStatus {
  private readonly _value: ReservationStatusType;
  private readonly allowedStatuses: ReservationStatusType[] = [
    'DRAFT', 'CONFIRMED', 'IN_TRANSIT', 'DELIVERED', 'PICKED_UP', 'RETURNED', 'INSPECTED', 'COMPLETED', 'CANCELLED'
  ];

  constructor(value: string) {
    if (!this.allowedStatuses.includes(value as ReservationStatusType)) {
      throw new InvalidValueObjectException('ReservationStatus', 'Invalid status value');
    }
    this._value = value as ReservationStatusType;
  }

  public value(): ReservationStatusType {
    return this._value;
  }
}
