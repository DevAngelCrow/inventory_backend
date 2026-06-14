import { InvalidValueObjectException } from '@/shared/domain/exceptions/invalid-value-object.exception';
import { Validator } from 'src/shared/domain/validator/validator-value-object';

export class CategoryPermissionsDescription {
  private readonly _value: string;

  constructor(value: string) {
    const createException = (msg: string): InvalidValueObjectException =>
      new InvalidValueObjectException('category permissions description', msg);

    this._value = Validator.of(value, createException)
      .required('Category permissions description is required')
      .string('Category permissions description must be a string')
      .minLength(
        2,
        'Category permissions description must be at least 2 characters long',
      )
      .maxLength(
        255,
        'Category permissions description must be at most 4 characters long',
      )
      .getValue();
  }
  public value(): string {
    return this._value;
  }
  public equals(other: CategoryPermissionsDescription): boolean {
    return this._value === other._value;
  }

  public toString(): string {
    return this._value.toString();
  }
}
