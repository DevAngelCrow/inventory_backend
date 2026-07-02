import { InvalidValueObjectException } from '@/shared/domain/exceptions/invalid-value-object.exception';
import { Validator } from '@/shared/domain/validator/validator-value-object';

export class ReservationCustomerId {
  private readonly _value: string;

  constructor(value: string) {
    this._value = Validator.of(
      value,
      (msg) => new InvalidValueObjectException('ReservationCustomerId', msg),
    )
      .required()
      .uuid()
      .getValue();
  }

  public value(): string {
    return this._value;
  }
}
