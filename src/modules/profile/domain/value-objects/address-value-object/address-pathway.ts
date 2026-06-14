import { InvalidValueObjectException } from '@/shared/domain/exceptions/invalid-value-object.exception';
import { Validator } from '@/shared/domain/validator/validator-value-object';

export class AddressPathway {
  private readonly _value: string;
  constructor(value: string) {
    const createException = (msg: string): InvalidValueObjectException =>
      new InvalidValueObjectException('address pathway', msg);
    this._value = Validator.of(value, createException)
      .required('Address pathway is required')
      .string('Address pathway must be a string')
      .minLength(1, 'Address pathway must be at least 1 character long')
      .maxLength(150, 'Address pathway must be at most 150 characters long')
      .getValue();
  }
  public value(): string {
    return this._value;
  }

  public equals(other: AddressPathway): boolean {
    return this._value === other._value;
  }

  public toString(): string {
    return this._value;
  }
}
