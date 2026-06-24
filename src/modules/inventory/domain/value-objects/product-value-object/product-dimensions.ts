import { InvalidValueObjectException } from 'src/shared/domain/exceptions/invalid-value-object.exception';
import { Validator } from 'src/shared/domain/validator/validator-value-object';

export class ProductDimensions {
  private readonly _value: string | undefined;

  constructor(value?: string) {
    if (value !== undefined && value !== null) {
      Validator.of(
        value,
        (msg) => new InvalidValueObjectException('ProductDimensions', msg),
      )
        .string('Product dimensions must be a string')
        .maxLength(100, 'Product dimensions must be at most 100 characters long')
        .getValue();
    }
    this._value = value;
  }

  public value(): string | undefined {
    return this._value;
  }

  public equals(other: ProductDimensions): boolean {
    return this._value === other._value;
  }

  public toString(): string {
    return this._value || '';
  }
}
