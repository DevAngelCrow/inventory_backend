import { InvalidValueObjectException } from 'src/shared/domain/exceptions/invalid-value-object.exception';
import { Validator } from 'src/shared/domain/validator/validator-value-object';

export class CountryPhoneCode {
  private readonly _value: string;

  constructor(value: string) {
    this._value = Validator.of(
      value,
      (msg) => new InvalidValueObjectException('CountryPhoneCode', msg),
    )
      .required('Country phone code is required')
      .string('Country phone code must be a string')
      .maxLength(150, 'Country phone code must be at most 150 characters long')
      .getValue();
  }

  public value(): string {
    return this._value;
  }

  public equals(other: CountryPhoneCode): boolean {
    return this._value === other._value;
  }

  public toString(): string {
    return this._value;
  }
}
