import { InvalidValueObjectException } from '@/shared/domain/exceptions/invalid-value-object.exception';
import { Validator } from '@/shared/domain/validator/validator-value-object';

export class AddressNeighborhood {
  private readonly _value: string;
  constructor(value: string) {
    const createException = (msg: string): InvalidValueObjectException =>
      new InvalidValueObjectException('address neighborhood', msg);
    this._value = Validator.of(value, createException)
      .required('Address neighborhood is required')
      .string('Address neighborhood must be a string')
      .minLength(1, 'Address neighborhood must be at least 1 character long')
      .maxLength(
        150,
        'Address neighborhood must be at most 100 characters long',
      )
      .getValue();
  }
  public value(): string {
    return this._value;
  }

  public equals(other: AddressNeighborhood): boolean {
    return this._value === other._value;
  }

  public toString(): string {
    return this._value;
  }
}
