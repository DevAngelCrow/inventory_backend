import { InvalidValueObjectException } from 'src/shared/domain/exceptions/invalid-value-object.exception';
import { Validator } from 'src/shared/domain/validator/validator-value-object';

export class ProductColor {
  private readonly _value: string | undefined;

  constructor(value?: string) {
    if (value !== undefined && value !== null) {
      Validator.of(
        value,
        (msg) => new InvalidValueObjectException('ProductColor', msg),
      )
        .string('Product color must be a string')
        .maxLength(50, 'Product color must be at most 50 characters long')
        .getValue();
    }
    this._value = value;
  }

  public value(): string | undefined {
    return this._value;
  }

  public equals(other: ProductColor): boolean {
    return this._value === other._value;
  }

  public toString(): string {
    return this._value || '';
  }
}
