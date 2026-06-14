import { InvalidValueObjectException } from 'src/shared/domain/exceptions/invalid-value-object.exception';
import { Validator } from 'src/shared/domain/validator/validator-value-object';

export class PersonEmail {
  private readonly _value: string;

  constructor(value: string) {
    this._value = Validator.of(
      value,
      (msg) => new InvalidValueObjectException('PersonEmail', msg),
    )
      .required('Person email is required')
      .string('Person email must be a string')
      .maxLength(100, 'Person email must be at most 100 characters long')
      .email('Person email must be a valid email address')
      .getValue();
  }

  public value(): string {
    return this._value;
  }

  public equals(other: PersonEmail): boolean {
    return this._value === other._value;
  }

  public toString(): string {
    return this._value;
  }
}
