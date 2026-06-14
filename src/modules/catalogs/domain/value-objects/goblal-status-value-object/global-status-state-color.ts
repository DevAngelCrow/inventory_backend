import { InvalidValueObjectException } from 'src/shared/domain/exceptions/invalid-value-object.exception';
import { Validator } from 'src/shared/domain/validator/validator-value-object';

export class GlobalStatusStateColor {
  private readonly _value: string;

  constructor(value: string) {
    this._value = Validator.of(
      value,
      (msg) => new InvalidValueObjectException('GlobalStatusStateColor', msg),
    )
      .required('Global status state color is required')
      .string('Global status state color must be a string')
      .maxLength(
        10,
        'Global status state color must be at most 100 characters long',
      )
      .getValue();
  }

  public value(): string {
    return this._value;
  }

  public equals(other: GlobalStatusStateColor): boolean {
    return this._value === other._value;
  }

  public toString(): string {
    return this._value;
  }
}
