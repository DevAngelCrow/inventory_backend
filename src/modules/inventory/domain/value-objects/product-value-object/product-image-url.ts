import { InvalidValueObjectException } from 'src/shared/domain/exceptions/invalid-value-object.exception';
import { Validator } from 'src/shared/domain/validator/validator-value-object';

export class ProductImageUrl {
  private readonly _value: string | undefined;

  constructor(value?: string) {
    if (value !== undefined && value !== null) {
      Validator.of(
        value,
        (msg) => new InvalidValueObjectException('ProductImageUrl', msg),
      )
        .string('Product image URL must be a string')
        .maxLength(500, 'Product image URL must be at most 500 characters long')
        .getValue();
    }
    this._value = value;
  }

  public value(): string | undefined {
    return this._value;
  }

  public equals(other: ProductImageUrl): boolean {
    return this._value === other._value;
  }

  public toString(): string {
    return this._value || '';
  }
}
