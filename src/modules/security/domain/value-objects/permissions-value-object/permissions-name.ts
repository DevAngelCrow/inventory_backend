import { InvalidValueObjectException } from '@/shared/domain/exceptions/invalid-value-object.exception';
import { Validator } from 'src/shared/domain/validator/validator-value-object';

export class PermissionsName {
  private readonly _value: string;

  constructor(value: string) {
    const createException = (msg: string): InvalidValueObjectException =>
      new InvalidValueObjectException('permissions name', msg);

    this._value = Validator.of(value, createException)
      .required('Permissions name is required')
      .string('Permissions name must be a string')
      .minLength(2, 'Permissions name must be at least 2 characters long')
      .maxLength(255, 'Permissions name must be at most 255 characters long')
      .getValue();
  }
  public value(): string {
    return this._value;
  }
  public equals(other: PermissionsName): boolean {
    return this._value === other._value;
  }

  public toString(): string {
    return this._value.toString();
  }
}
