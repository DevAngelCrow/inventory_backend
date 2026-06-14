import { InvalidValueObjectException } from '@/shared/domain/exceptions/invalid-value-object.exception';
import { Validator } from 'src/shared/domain/validator/validator-value-object';

export class RoutesIcon {
  private readonly _value: string;

  constructor(value: string) {
    const createException = (msg: string): InvalidValueObjectException =>
      new InvalidValueObjectException('routes icon', msg);

    this._value = Validator.of(value, createException)
      .required('Routes icon is required')
      .string('Routes icon must be a string')
      .minLength(2, 'Routes icon must be at least 2 characters long')
      .maxLength(255, 'Routes icon must be at most 255 characters long')
      .getValue();
  }
  public value(): string {
    return this._value;
  }
  public equals(other: RoutesIcon): boolean {
    return this._value === other._value;
  }

  public toString(): string {
    return this._value.toString();
  }
}
