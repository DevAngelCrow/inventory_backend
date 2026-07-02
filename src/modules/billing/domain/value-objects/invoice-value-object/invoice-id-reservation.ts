import { InvalidValueObjectException } from '@/shared/domain/exceptions/invalid-value-object.exception';
import { Validator } from '@/shared/domain/validator/validator-value-object';

export class InvoiceIdReservation {
  private readonly _value: string;

  constructor(value: string) {
    this._value = Validator.of(
      value,
      (msg) => new InvalidValueObjectException('InvoiceIdReservation', msg),
    )
      .required('Reservation ID is required')
      .uuid('Reservation ID must be a valid UUID')
      .getValue();
  }

  public value(): string {
    return this._value;
  }
}
