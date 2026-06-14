import { InvalidValueObjectException } from 'src/shared/domain/exceptions/invalid-value-object.exception';
import { Validator } from 'src/shared/domain/validator/validator-value-object';

export class CategoryStatusCode {
  private readonly _value: string;

  constructor(value: string) {
    this._value = Validator.of(
      value,
      (msg) => new InvalidValueObjectException('CategoryStatusCode', msg),
    )
      .required('Category status code is required')
      .string('Category status code must be a string')
      .maxLength(10, 'Category status code must be at most 10 characters long')
      .getValue();
  }

  public value(): string {
    return this._value;
  }

  public equals(other: CategoryStatusCode): boolean {
    return this._value === other._value;
  }

  public toString(): string {
    return this._value;
  }
}
