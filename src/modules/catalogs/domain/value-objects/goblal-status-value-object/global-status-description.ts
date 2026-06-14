import { InvalidValueObjectException } from 'src/shared/domain/exceptions/invalid-value-object.exception';
import { Validator } from 'src/shared/domain/validator/validator-value-object';

export class GlobalStatusDescription {
  private readonly _value: string;

  constructor(value: string) {
    this._value = Validator.of(
      value,
      (msg) => new InvalidValueObjectException('GlobalStatusDescription', msg),
    )
      .required('Global status description is required')
      .string('Global status description must be a string')
      .maxLength(
        100,
        'Global status description must be at most 100 characters long',
      )
      .getValue();
  }

  public value(): string {
    return this._value;
  }

  public equals(other: GlobalStatusDescription): boolean {
    return this._value === other._value;
  }

  public toString(): string {
    return this._value;
  }
}
