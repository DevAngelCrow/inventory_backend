import { InvalidValueObjectException } from '@/shared/domain/exceptions/invalid-value-object.exception';
import { Validator } from '@/shared/domain/validator/validator-value-object';

export class InvoiceLineTotal {
  private readonly _value: number;

  constructor(value: number) {
    this._value = Validator.of(
      value,
      (msg) => new InvalidValueObjectException('InvoiceLineTotal', msg),
    )
      .required('Total is required')
      .number('Total must be a number')
      .min(0, 'Total cannot be negative')
      .getValue();
  }

  public value(): number {
    return this._value;
  }
}
