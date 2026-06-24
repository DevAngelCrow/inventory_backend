import { InvalidValueObjectException } from '@/shared/domain/exceptions/invalid-value-object.exception';
import { Validator } from '@/shared/domain/validator/validator-value-object';

export class InvoiceFiscalStatus {
  private readonly _value: string;

  constructor(value: string) {
    this._value = Validator.of(
      value,
      (msg) => new InvalidValueObjectException('InvoiceFiscalStatus', msg),
    )
      .required('Fiscal status cannot be null if provided')
      .string('Fiscal status must be a string')
      .maxLength(50, 'Fiscal status must not exceed 50 characters')
      .getValue();
  }

  public value(): string {
    return this._value;
  }
}
