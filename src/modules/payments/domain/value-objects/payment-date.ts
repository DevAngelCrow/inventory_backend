import { InvalidValueObjectException } from '@/shared/domain/exceptions/invalid-value-object.exception';

export class PaymentDate {
  private readonly _value: Date;

  constructor(value: Date) {
    if (!(value instanceof Date) || isNaN(value.getTime())) {
      throw new InvalidValueObjectException('PaymentDate', 'Invalid date');
    }
    this._value = value;
  }

  public value(): Date {
    return this._value;
  }
}
