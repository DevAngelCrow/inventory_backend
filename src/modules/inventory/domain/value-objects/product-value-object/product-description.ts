import { InvalidValueObjectException } from '@/shared/domain/exceptions/invalid-value-object.exception';
import { Validator } from '@/shared/domain/validator/validator-value-object';

export class ProductDescription {
  private readonly _value: string | undefined;

  constructor(value?: string) {
    if (value !== undefined && value !== null) {
      this._value = Validator.of(
        value,
        (msg) => new InvalidValueObjectException('ProductDescription', msg),
      )
        .maxLength(500, 'Product description must not exceed 500 characters')
        .getValue();
    } else {
      this._value = undefined;
    }
  }

  public value(): string | undefined {
    return this._value;
  }
}
