import { InvalidValueObjectException } from 'src/shared/domain/exceptions/invalid-value-object.exception';
import { Validator } from 'src/shared/domain/validator/validator-value-object';

export class CategoryStatusName {
  private readonly _value: string;

  constructor(value: string) {
    this._value = Validator.of(
      value,
      (msg) => new InvalidValueObjectException('CategoryStatusName', msg),
    )
      .required('Category status name is required')
      .string('Category status name must be a string')
      .maxLength(
        150,
        'Category status name must be at most 150 characters long',
      )
      .getValue();
  }

  public value(): string {
    return this._value;
  }

  public equals(other: CategoryStatusName): boolean {
    return this._value === other._value;
  }

  public toString(): string {
    return this._value;
  }
}
