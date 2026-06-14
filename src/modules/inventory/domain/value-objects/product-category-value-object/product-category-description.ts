import { InvalidValueObjectException } from 'src/shared/domain/exceptions/invalid-value-object.exception';
import { Validator } from 'src/shared/domain/validator/validator-value-object';

export class ProductCategoryDescription {
  private readonly _value: string | undefined;

  constructor(value?: string) {
    if (value !== undefined && value !== null) {
      this._value = Validator.of(
        value,
        (msg) => new InvalidValueObjectException('ProductCategoryDescription', msg),
      )
        .maxLength(255, 'Product category description must not exceed 255 characters')
        .getValue();
    } else {
      this._value = undefined;
    }
  }

  public value(): string | undefined {
    return this._value;
  }
}
