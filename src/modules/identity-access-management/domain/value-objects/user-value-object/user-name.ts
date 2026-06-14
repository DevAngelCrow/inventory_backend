import { InvalidValueObjectException } from 'src/shared/domain/exceptions/invalid-value-object.exception';
import { Validator } from 'src/shared/domain/validator/validator-value-object';

export class UserName {
  private readonly _value: string;

  constructor(value: string) {
    const createException = (msg: string): InvalidValueObjectException =>
      new InvalidValueObjectException('UserName', msg);

    this._value = Validator.of(value, createException)
      .required('User name is required')
      .string('User name must be a string')
      .getValue();
  }

  public value(): string {
    return this._value;
  }

  public equals(other: UserName): boolean {
    return this._value === other._value;
  }

  public toString(): string {
    return this._value;
  }
}
