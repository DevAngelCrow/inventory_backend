import { InvalidValueObjectException } from 'src/shared/domain/exceptions/invalid-value-object.exception';
import { Validator } from 'src/shared/domain/validator/validator-value-object';

export class UserLastAccess {
  private readonly _value: Date;

  constructor(value: Date) {
    this._value = Validator.of(
      value,
      (msg) => new InvalidValueObjectException('UserLastAccess', msg),
    )
      .required('User last access is required')
      .date('User last access must be a valid date')
      .getValue();
  }

  public value(): Date {
    return this._value;
  }

  public equals(other: UserLastAccess): boolean {
    return this._value.getTime() === other._value.getTime();
  }

  public toString(): string {
    return this._value.toISOString();
  }

  public toISOString(): string {
    return this._value.toISOString();
  }
}
