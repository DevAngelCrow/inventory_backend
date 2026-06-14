import { InvalidValueObjectException } from 'src/shared/domain/exceptions/invalid-value-object.exception';
import { Validator } from 'src/shared/domain/validator/validator-value-object';

export class UserPassword {
  private readonly _value: string;

  constructor(value: string) {
    const createException = (msg: string): InvalidValueObjectException =>
      new InvalidValueObjectException('UserPassword', msg);

    this._value = Validator.of(value, createException)
      .required('User password is required')
      .string('User password must be a string')
      .getValue();
    if (value.length < 8) {
      throw createException('User password must be at least 8 characters long');
    }

    const hasNumber = /\d/.test(value);
    const hasLetter = /[a-zA-Z]/.test(value);
    if (!hasNumber || !hasLetter) {
      throw createException(
        'La contraseña debe contener al menos una letra y un número',
      );
    }
    this._value = value;
  }

  public value(): string {
    return this._value;
  }

  public equals(other: UserPassword): boolean {
    return this._value === other._value;
  }

  public toString(): string {
    return this._value;
  }
}
