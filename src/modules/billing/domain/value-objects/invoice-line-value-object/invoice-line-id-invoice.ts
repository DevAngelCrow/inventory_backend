import { InvalidValueObjectException } from '@/shared/domain/exceptions/invalid-value-object.exception';
import { Validator } from '@/shared/domain/validator/validator-value-object';

export class InvoiceLineIdInvoice {
  private readonly _value: string;

  constructor(value: string) {
    this._value = Validator.of(
      value,
      (msg) => new InvalidValueObjectException('InvoiceLineIdInvoice', msg),
    )
      .required('Invoice ID cannot be null if provided')
      .uuid('Invoice ID must be a valid UUID')
      .getValue();
  }

  public value(): string {
    return this._value;
  }
}
