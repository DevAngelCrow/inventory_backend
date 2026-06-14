import { InvalidValueObjectException } from '@/shared/domain/exceptions/invalid-value-object.exception';
import { Validator } from '@/shared/domain/validator/validator-value-object';

export class AddressHouseNumber {
  private readonly _value: string;
  constructor(value: string) {
    const createException = (msg: string): InvalidValueObjectException =>
      new InvalidValueObjectException('address house number', msg);

    this._value = Validator.of(value, createException)
      .required('Address house number is required')
      .string('Address house number must be a string')
      .minLength(1, 'Address house number must be at least 1 character long')
      .maxLength(7, 'Address house number must be at most 7 characters long')
      .getValue();
  }
  public value(): string {
    return this._value;
  }
}
