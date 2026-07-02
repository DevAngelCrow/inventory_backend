import { InvalidValueObjectException } from '@/shared/domain/exceptions/invalid-value-object.exception';
import { Validator } from '@/shared/domain/validator/validator-value-object';

export class InvoiceFiscalId {
  private readonly _value: string;

  constructor(value: string) {
    this._value = Validator.of(
      value,
      (msg) => new InvalidValueObjectException('InvoiceFiscalId', msg),
    )
      .required('Fiscal ID cannot be null if provided')
      .string('Fiscal ID must be a string')
      .maxLength(100, 'Fiscal ID must not exceed 100 characters')
      .getValue();
  }

  public value(): string {
    return this._value;
  }
}
