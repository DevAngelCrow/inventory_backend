import { InvalidValueObjectException } from 'src/shared/domain/exceptions/invalid-value-object.exception';
import { Validator } from 'src/shared/domain/validator/validator-value-object';

export class PersonMiddleName {
  private readonly _value: string;

  constructor(value: string) {
    this._value = Validator.of(
      value,
      (msg) => new InvalidValueObjectException('PersonMiddleName', msg),
    )
      .required('Person middle name is required')
      .string('Person middle name must be a string')
      .maxLength(150, 'Person middle name must be at most 150 characters long')
      .getValue();
  }

  public value(): string {
    return this._value;
  }

  public equals(other: PersonMiddleName): boolean {
    return this._value === other._value;
  }

  public toString(): string {
    return this._value;
  }
}
