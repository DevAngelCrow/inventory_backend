import { InvalidValueObjectException } from 'src/shared/domain/exceptions/invalid-value-object.exception';
import { Validator } from 'src/shared/domain/validator/validator-value-object';

export class GlobalStatusTextColor {
  private readonly _value: string;

  constructor(value: string) {
    this._value = Validator.of(
      value,
      (msg) => new InvalidValueObjectException('GlobalStatusTextColor', msg),
    )
      .required('Global status text color is required')
      .string('Global status text color must be a string')
      .maxLength(
        10,
        'Global status text color must be at most 10 characters long',
      )
      .getValue();
  }

  public value(): string {
    return this._value;
  }

  public equals(other: GlobalStatusTextColor): boolean {
    return this._value === other._value;
  }

  public toString(): string {
    return this._value;
  }
}
