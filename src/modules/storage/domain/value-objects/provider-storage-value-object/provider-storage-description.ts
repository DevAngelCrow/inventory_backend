import { InvalidValueObjectException } from '@/shared/domain/exceptions/invalid-value-object.exception';
import { Validator } from '@/shared/domain/validator/validator-value-object';

export class ProviderStorageDescription {
  private readonly _value: string;
  constructor(value: string) {
    const createException = (msg: string): InvalidValueObjectException =>
      new InvalidValueObjectException('provider storage description', msg);
    this._value = Validator.of(value, createException)
      .string('Provider storage description must be a string')
      .minLength(
        1,
        'Provider storage description must be at least 1 character long',
      )
      .maxLength(
        150,
        'Provider storage description must be at most 150 characters long',
      )
      .getValue();
  }
  public value(): string {
    return this._value;
  }

  public equals(other: ProviderStorageDescription): boolean {
    return this._value === other._value;
  }

  public toString(): string {
    return this._value;
  }
}
