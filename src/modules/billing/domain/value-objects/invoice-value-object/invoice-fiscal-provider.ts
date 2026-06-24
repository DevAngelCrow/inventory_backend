import { InvalidValueObjectException } from '@/shared/domain/exceptions/invalid-value-object.exception';
import { Validator } from '@/shared/domain/validator/validator-value-object';

export class InvoiceFiscalProvider {
  private readonly _value: string;

  constructor(value: string) {
    this._value = Validator.of(
      value,
      (msg) => new InvalidValueObjectException('InvoiceFiscalProvider', msg),
    )
      .required('Fiscal provider cannot be null if provided')
      .string('Fiscal provider must be a string')
      .maxLength(100, 'Fiscal provider must not exceed 100 characters')
      .getValue();
  }

  public value(): string {
    return this._value;
  }
}
