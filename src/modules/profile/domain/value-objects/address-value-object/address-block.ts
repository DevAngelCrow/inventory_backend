import { InvalidValueObjectException } from '@/shared/domain/exceptions/invalid-value-object.exception';
import { Validator } from '@/shared/domain/validator/validator-value-object';

export class AddressBlock {
  private readonly _value: string;
  constructor(value: string) {
    const createException = (msg: string): InvalidValueObjectException =>
      new InvalidValueObjectException('address block', msg);

    this._value = Validator.of(value, createException)
      .required('Address block is required')
      .string('Address block must be a string')
      .minLength(1, 'Address block must be at least 1 character long')
      .maxLength(150, 'Address block must be at most 150 characters long')
      .getValue();
  }
  public value(): string {
    return this._value;
  }
}
