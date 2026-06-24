import { InvalidValueObjectException } from '@/shared/domain/exceptions/invalid-value-object.exception';
import { Validator } from '@/shared/domain/validator/validator-value-object';

export class InvoiceLineSubtotal {
  private readonly _value: number;

  constructor(value: number) {
    this._value = Validator.of(
      value,
      (msg) => new InvalidValueObjectException('InvoiceLineSubtotal', msg),
    )
      .required('Subtotal is required')
      .number('Subtotal must be a number')
      .min(0, 'Subtotal cannot be negative')
      .getValue();
  }

  public value(): number {
    return this._value;
  }
}
