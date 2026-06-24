import { InvalidValueObjectException } from 'src/shared/domain/exceptions/invalid-value-object.exception';
import { Validator } from 'src/shared/domain/validator/validator-value-object';

export class ProductCategoryIcon {
  private readonly _value: string | undefined;

  constructor(value?: string) {
    if (value !== undefined && value !== null) {
      Validator.of(
        value,
        (msg) => new InvalidValueObjectException('ProductCategoryIcon', msg),
      )
        .string('Product category icon must be a string')
        .maxLength(255, 'Product category icon must be at most 255 characters long')
        .getValue();
    }
    this._value = value;
  }

  public value(): string | undefined {
    return this._value;
  }

  public equals(other: ProductCategoryIcon): boolean {
    return this._value === other._value;
  }

  public toString(): string {
    return this._value || '';
  }
}
