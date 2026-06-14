import { InvalidValueObjectException } from '@/shared/domain/exceptions/invalid-value-object.exception';
import { Validator } from 'src/shared/domain/validator/validator-value-object';

export class CategoryPermissionsName {
  private readonly _value: string;

  constructor(value: string) {
    const createException = (msg: string): InvalidValueObjectException =>
      new InvalidValueObjectException('category permissions name', msg);

    this._value = Validator.of(value, createException)
      .required('Category permissions name is required')
      .string('Category permissions name must be a string')
      .minLength(
        2,
        'Category permissions name must be at least 2 characters long',
      )
      .maxLength(
        255,
        'Category permissions name must be at most 255 characters long',
      )
      .getValue();
  }
  public value(): string {
    return this._value;
  }
  public equals(other: CategoryPermissionsName): boolean {
    return this._value === other._value;
  }

  public toString(): string {
    return this._value.toString();
  }
}
