import { InvalidValueObjectException } from 'src/shared/domain/exceptions/invalid-value-object.exception';
import { Validator } from 'src/shared/domain/validator/validator-value-object';

export class UserIdPeople {
  private readonly _value: string;

  constructor(value: string) {
    this._value = Validator.of(
      value,
      (msg) => new InvalidValueObjectException('UserIdPeople', msg),
    )
      .required('User id people is required')
      .uuid('User id people Must be a valid UUID')
      .getValue();
  }

  public value(): string {
    return this._value;
  }

  public equals(other: UserIdPeople): boolean {
    return this._value === other._value;
  }

  public toString(): string {
    return this._value.toString();
  }
}
