import { InvalidValueObjectException } from '@/shared/domain/exceptions/invalid-value-object.exception';
import { Validator } from 'src/shared/domain/validator/validator-value-object';

export class RoutesTitle {
  private readonly _value: string;

  constructor(value: string) {
    const createException = (msg: string): InvalidValueObjectException =>
      new InvalidValueObjectException('routes title', msg);

    this._value = Validator.of(value, createException)
      .required('Routes title is required')
      .string('Routes title must be a string')
      .minLength(2, 'Routes title must be at least 2 characters long')
      .maxLength(255, 'Routes title must be at most 255 characters long')
      .getValue();
  }
  public value(): string {
    return this._value;
  }
  public equals(other: RoutesTitle): boolean {
    return this._value === other._value;
  }

  public toString(): string {
    return this._value.toString();
  }
}
