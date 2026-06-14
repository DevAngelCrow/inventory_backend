import { InvalidValueObjectException } from 'src/shared/domain/exceptions/invalid-value-object.exception';
import { Validator } from 'src/shared/domain/validator/validator-value-object';

export class GlobalStatusName {
  private readonly _value: string;

  constructor(value: string) {
    this._value = Validator.of(
      value,
      (msg) => new InvalidValueObjectException('GlobalStatusName', msg),
    )
      .required('Global status name is required')
      .string('Global status name must be a string')
      .maxLength(100, 'Global status name must be at most 100 characters long')
      .getValue();
  }

  public value(): string {
    return this._value;
  }

  public equals(other: GlobalStatusName): boolean {
    return this._value === other._value;
  }

  public toString(): string {
    return this._value;
  }
}
