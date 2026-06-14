import { InvalidValueObjectException } from '@/shared/domain/exceptions/invalid-value-object.exception';
import { Validator } from '@/shared/domain/validator/validator-value-object';

export class AddressStreetNumber {
  private readonly _value: string;
  constructor(value: string) {
    const createException = (msg: string): InvalidValueObjectException =>
      new InvalidValueObjectException('address street number', msg);
    this._value = Validator.of(value, createException)
      .required('Address street number is required')
      .string('Address street number must be a string')
      .minLength(1, 'Address street number must be at least 1 character long')
      .maxLength(
        150,
        'Address street number must be at most 150 characters long',
      )
      .getValue();
  }
  public value(): string {
    return this._value;
  }

  public equals(other: AddressStreetNumber): boolean {
    return this._value === other._value;
  }

  public toString(): string {
    return this._value;
  }
}
