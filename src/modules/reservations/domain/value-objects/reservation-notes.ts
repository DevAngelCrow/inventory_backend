import { InvalidValueObjectException } from '@/shared/domain/exceptions/invalid-value-object.exception';
import { Validator } from '@/shared/domain/validator/validator-value-object';

export class ReservationNotes {
  private readonly _value: string | undefined;

  constructor(value?: string) {
    if (value) {
      this._value = Validator.of(
        value,
        (msg) => new InvalidValueObjectException('ReservationNotes', msg),
      ).getValue();
    } else {
      this._value = undefined;
    }
  }

  public value(): string | undefined {
    return this._value;
  }
}
