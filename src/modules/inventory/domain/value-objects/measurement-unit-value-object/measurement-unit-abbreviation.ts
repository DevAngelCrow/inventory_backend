import { InvalidValueObjectException } from 'src/shared/domain/exceptions/invalid-value-object.exception';
import { Validator } from 'src/shared/domain/validator/validator-value-object';

export class MeasurementUnitAbbreviation {
  private readonly _value: string;

  constructor(value: string) {
    Validator.of(
      value,
      (msg) => new InvalidValueObjectException('MeasurementUnitAbbreviation', msg),
    )
      .string('Measurement unit abbreviation must be a string')
      .minLength(1, 'Measurement unit abbreviation cannot be empty')
      .maxLength(10, 'Measurement unit abbreviation must be at most 10 characters')
      .getValue();
    this._value = value;
  }

  public value(): string {
    return this._value;
  }

  public equals(other: MeasurementUnitAbbreviation): boolean {
    return this._value === other.value();
  }
}
