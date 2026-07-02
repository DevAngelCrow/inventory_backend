import { InvalidValueObjectException } from 'src/shared/domain/exceptions/invalid-value-object.exception';
import { Validator } from 'src/shared/domain/validator/validator-value-object';

export class ProductNotes {
  private readonly _value: string | undefined;

  constructor(value?: string) {
    if (value !== undefined && value !== null) {
      Validator.of(
        value,
        (msg) => new InvalidValueObjectException('ProductNotes', msg),
      )
        .string('Product notes must be a string')
        .maxLength(1000, 'Product notes must be at most 1000 characters long')
        .getValue();
    }
    this._value = value;
  }

  public value(): string | undefined {
    return this._value;
  }

  public equals(other: ProductNotes): boolean {
    return this._value === other._value;
  }

  public toString(): string {
    return this._value || '';
  }
}
