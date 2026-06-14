import { InvalidValueObjectException } from '@/shared/domain/exceptions/invalid-value-object.exception';
import { Validator } from 'src/shared/domain/validator/validator-value-object';

export class CountryIso2 {
  private readonly _value: string;

  constructor(value: string) {
    const createException = (msg: string): InvalidValueObjectException =>
      new InvalidValueObjectException('country ISO2', msg);

    this._value = Validator.of(value, createException)
      .required('Country ISO2 is required')
      .string('Country ISO2 must be a string')
      .minLength(2, 'Country ISO2 must be at least 2 characters long')
      .maxLength(2, 'Country ISO2 must be at most 2 characters long')
      .getValue();
  }
  public value(): string {
    return this._value;
  }
}
