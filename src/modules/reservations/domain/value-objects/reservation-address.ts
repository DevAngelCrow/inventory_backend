import { InvalidValueObjectException } from '@/shared/domain/exceptions/invalid-value-object.exception';
import { Validator } from '@/shared/domain/validator/validator-value-object';

export class ReservationAddress {
  private readonly _value: string | undefined;

  constructor(value?: string) {
    if (value) {
      this._value = Validator.of(
        value,
        (msg) => new InvalidValueObjectException('ReservationAddress', msg),
      )
        .maxLength(500, 'Delivery address must not exceed 500 characters')
        .getValue();
    } else {
      this._value = undefined;
    }
  }

  public value(): string | undefined {
    return this._value;
  }
}
