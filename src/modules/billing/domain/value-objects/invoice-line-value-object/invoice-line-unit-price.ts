import { InvalidValueObjectException } from '@/shared/domain/exceptions/invalid-value-object.exception';
import { Validator } from '@/shared/domain/validator/validator-value-object';

export class InvoiceLineUnitPrice {
  private readonly _value: number;

  constructor(value: number) {
    this._value = Validator.of(
      value,
      (msg) => new InvalidValueObjectException('InvoiceLineUnitPrice', msg),
    )
      .required('Unit price is required')
      .number('Unit price must be a number')
      .min(0, 'Unit price cannot be negative')
      .getValue();
  }

  public value(): number {
    return this._value;
  }
}
