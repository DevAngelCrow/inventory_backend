import { InvalidValueObjectException } from '@/shared/domain/exceptions/invalid-value-object.exception';
import { Validator } from '@/shared/domain/validator/validator-value-object';

export class InvoiceNumber {
  private readonly _value: string;

  constructor(value: string) {
    this._value = Validator.of(
      value,
      (msg) => new InvalidValueObjectException('InvoiceNumber', msg),
    )
      .required('Invoice number is required')
      .string('Invoice number must be a string')
      .maxLength(100, 'Invoice number must not exceed 100 characters')
      .getValue();
  }

  public value(): string {
    return this._value;
  }
}
