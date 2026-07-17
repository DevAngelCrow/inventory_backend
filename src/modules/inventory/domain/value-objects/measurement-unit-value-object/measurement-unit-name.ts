import { InvalidValueObjectException } from 'src/shared/domain/exceptions/invalid-value-object.exception';
import { Validator } from 'src/shared/domain/validator/validator-value-object';

export class MeasurementUnitName {
  private readonly _value: string;

  constructor(value: string) {
    Validator.of(
      value,
      (msg) => new InvalidValueObjectException('MeasurementUnitName', msg),
    )
      .string('Measurement unit name must be a string')
      .minLength(1, 'Measurement unit name cannot be empty')
      .maxLength(100, 'Measurement unit name must be at most 100 characters')
      .getValue();
    this._value = value;
  }

  public value(): string {
    return this._value;
  }

  public equals(other: MeasurementUnitName): boolean {
    return this._value === other.value();
  }
}
