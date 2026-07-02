import { InvalidValueObjectException } from '@/shared/domain/exceptions/invalid-value-object.exception';
import { Validator } from '@/shared/domain/validator/validator-value-object';

export class ReservationItemQuantity {
  private readonly _value: number;

  constructor(value: number) {
    this._value = Validator.of(
      value,
      (msg) => new InvalidValueObjectException('ReservationItemQuantity', msg),
    )
      .required()
      .number()
      .min(1, 'Quantity must be at least 1')
      .getValue();
  }

  public value(): number {
    return this._value;
  }
}
