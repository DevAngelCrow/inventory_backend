import { InvalidValueObjectException } from '@/shared/domain/exceptions/invalid-value-object.exception';
import { Validator } from '@/shared/domain/validator/validator-value-object';

export class InvoiceLineId {
  private readonly _value: string;

  constructor(value: string) {
    this._value = Validator.of(
      value,
      (msg) => new InvalidValueObjectException('InvoiceLineId', msg),
    )
      .required('Invoice Line ID is required')
      .uuid('Invoice Line ID must be a valid UUID')
      .getValue();
  }

  public value(): string {
    return this._value;
  }
}
