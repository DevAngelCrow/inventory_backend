import { InvalidValueObjectException } from '@/shared/domain/exceptions/invalid-value-object.exception';
import { Validator } from '@/shared/domain/validator/validator-value-object';

export class InvoiceIdCustomer {
  private readonly _value: string;

  constructor(value: string) {
    this._value = Validator.of(
      value,
      (msg) => new InvalidValueObjectException('InvoiceIdCustomer', msg),
    )
      .required('Customer ID is required')
      .uuid('Customer ID must be a valid UUID')
      .getValue();
  }

  public value(): string {
    return this._value;
  }
}
