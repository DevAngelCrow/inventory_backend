import { InvalidValueObjectException } from '@/shared/domain/exceptions/invalid-value-object.exception';

export type ReservationStatusType = 'PENDING' | 'CONFIRMED' | 'DELIVERED' | 'RETURNED' | 'CANCELLED';

export class ReservationStatus {
  private readonly _value: ReservationStatusType;
  private readonly allowedStatuses: ReservationStatusType[] = [
    'PENDING', 'CONFIRMED', 'DELIVERED', 'RETURNED', 'CANCELLED'
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
