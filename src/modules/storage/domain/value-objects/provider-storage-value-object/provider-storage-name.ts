import { InvalidValueObjectException } from '@/shared/domain/exceptions/invalid-value-object.exception';
import { Validator } from '@/shared/domain/validator/validator-value-object';

export class ProviderStorageName {
  private readonly _value: string;
  constructor(value: string) {
    const createException = (msg: string): InvalidValueObjectException =>
      new InvalidValueObjectException('provider storage name', msg);
    this._value = Validator.of(value, createException)
      .required('Provider storage name is required')
      .string('Provider storage name must be a string')
      .minLength(1, 'Provider storage name must be at least 1 character long')
      .maxLength(
        150,
        'Provider storage name must be at most 150 characters long',
      )
      .getValue();
  }
  public value(): string {
    return this._value;
  }

  public equals(other: ProviderStorageName): boolean {
    return this._value === other._value;
  }

  public toString(): string {
    return this._value;
  }
}
