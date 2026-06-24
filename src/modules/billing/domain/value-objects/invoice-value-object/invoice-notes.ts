import { InvalidValueObjectException } from '@/shared/domain/exceptions/invalid-value-object.exception';
import { Validator } from '@/shared/domain/validator/validator-value-object';

export class InvoiceNotes {
  private readonly _value: string;

  constructor(value: string) {
    this._value = Validator.of(
      value,
      (msg) => new InvalidValueObjectException('InvoiceNotes', msg),
    )
      .required('Notes cannot be null if provided')
      .string('Notes must be a string')
      .maxLength(500, 'Notes must not exceed 500 characters')
      .getValue();
  }

  public value(): string {
    return this._value;
  }
}
