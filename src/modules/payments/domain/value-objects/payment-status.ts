import { InvalidValueObjectException } from '@/shared/domain/exceptions/invalid-value-object.exception';

export type PaymentStatusType =
  | 'PENDING'
  | 'COMPLETED'
  | 'FAILED'
  | 'REFUNDED'
  | 'CANCELLED';

export class PaymentStatus {
  private readonly _value: PaymentStatusType;
  private readonly allowedStatuses: PaymentStatusType[] = [
    'PENDING',
    'COMPLETED',
    'FAILED',
    'REFUNDED',
    'CANCELLED',
  ];

  constructor(value: string) {
    if (!this.allowedStatuses.includes(value as PaymentStatusType)) {
      throw new InvalidValueObjectException(
        'PaymentStatus',
        'Invalid status value',
      );
    }
    this._value = value as PaymentStatusType;
  }

  public value(): PaymentStatusType {
    return this._value;
  }
}
