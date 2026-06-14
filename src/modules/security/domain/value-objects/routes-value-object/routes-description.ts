import { InvalidValueObjectException } from '@/shared/domain/exceptions/invalid-value-object.exception';
import { Validator } from 'src/shared/domain/validator/validator-value-object';

export class RoutesDescription {
  private readonly _value: string;

  constructor(value: string) {
    const createException = (msg: string): InvalidValueObjectException =>
      new InvalidValueObjectException('routes description', msg);

    this._value = Validator.of(value, createException)
      .required('Routes description is required')
      .string('Routes description must be a string')
      .minLength(2, 'Routes description must be at least 2 characters long')
      .maxLength(255, 'Routes description must be at most 255 characters long')
      .getValue();
  }
  public value(): string {
    return this._value;
  }
  public equals(other: RoutesDescription): boolean {
    return this._value === other._value;
  }

  public toString(): string {
    return this._value.toString();
  }
}
