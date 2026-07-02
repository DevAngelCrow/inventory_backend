import { InvalidValueObjectException } from '@/shared/domain/exceptions/invalid-value-object.exception';
import { Validator } from '@/shared/domain/validator/validator-value-object';

export class InvoiceLineDescription {
  private readonly _value: string;

  constructor(value: string) {
    this._value = Validator.of(
      value,
      (msg) => new InvalidValueObjectException('InvoiceLineDescription', msg),
    )
      .required('Description is required')
      .string('Description must be a string')
      .maxLength(255, 'Description must not exceed 255 characters')
      .getValue();
  }

  public value(): string {
    return this._value;
  }
}
