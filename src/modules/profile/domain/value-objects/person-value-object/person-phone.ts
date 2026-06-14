import { InvalidValueObjectException } from 'src/shared/domain/exceptions/invalid-value-object.exception';
import { Validator } from 'src/shared/domain/validator/validator-value-object';

export class PersonPhone {
  private readonly _value: string;

  constructor(value: string) {
    this._value = Validator.of(
      value,
      (msg) => new InvalidValueObjectException('PersonPhone', msg),
    )
      .required('Person phone is required')
      .string('Person phone must be a string')
      .maxLength(14, 'Person phone must be at most 14 characters long')
      .getValue();
  }

  public value(): string {
    return this._value;
  }

  public equals(other: PersonPhone): boolean {
    return this._value === other._value;
  }

  public toString(): string {
    return this._value;
  }
}
