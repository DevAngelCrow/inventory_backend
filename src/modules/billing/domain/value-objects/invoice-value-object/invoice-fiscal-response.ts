import { InvalidValueObjectException } from '@/shared/domain/exceptions/invalid-value-object.exception';
import { Validator } from '@/shared/domain/validator/validator-value-object';

export class InvoiceFiscalResponse {
  private readonly _value: any;

  constructor(value: any) {
    this._value = Validator.of(
      value,
      (msg) => new InvalidValueObjectException('InvoiceFiscalResponse', msg),
    )
      .required('Fiscal response cannot be null if provided')
      .getValue();
  }

  public value(): any {
    return this._value;
  }
}
