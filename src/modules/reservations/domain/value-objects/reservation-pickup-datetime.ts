import { InvalidValueObjectException } from '@/shared/domain/exceptions/invalid-value-object.exception';
import { Validator } from '@/shared/domain/validator/validator-value-object';

export class ReservationPickupDatetime {
  private readonly _value: Date;

  constructor(value: Date) {
    this._value = Validator.of(
      value,
      (msg) => new InvalidValueObjectException('ReservationPickupDatetime', msg),
    )
      .required()
      .date()
      .getValue();
  }

  public value(): Date {
    return this._value;
  }
}
