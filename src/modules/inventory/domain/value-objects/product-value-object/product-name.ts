import { InvalidValueObjectException } from '@/shared/domain/exceptions/invalid-value-object.exception';
import { Validator } from '@/shared/domain/validator/validator-value-object';

export class ProductName {
  private readonly _value: string;

  constructor(value: string) {
    this._value = Validator.of(
      value,
      (msg) => new InvalidValueObjectException('ProductName', msg),
    )
      .required()
      .maxLength(200, 'Product name must not exceed 200 characters')
      .getValue();
  }

  public value(): string {
    return this._value;
  }
}
