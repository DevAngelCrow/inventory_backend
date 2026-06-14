import { InvalidValueObjectException } from 'src/shared/domain/exceptions/invalid-value-object.exception';
import { Validator } from 'src/shared/domain/validator/validator-value-object';

export class CategoryStatusDescription {
  private readonly _value: string;

  constructor(value: string) {
    this._value = Validator.of(
      value,
      (msg) =>
        new InvalidValueObjectException('CategoryStatusDescription', msg),
    )
      .required('Category status description is required')
      .string('Category status description must be a string')
      .maxLength(
        150,
        'Category status description must be at most 150 characters long',
      )
      .getValue();
  }

  public value(): string {
    return this._value;
  }

  public equals(other: CategoryStatusDescription): boolean {
    return this._value === other._value;
  }

  public toString(): string {
    return this._value;
  }
}
