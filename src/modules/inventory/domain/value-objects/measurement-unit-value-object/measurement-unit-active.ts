import { InvalidValueObjectException } from 'src/shared/domain/exceptions/invalid-value-object.exception';
import { Validator } from 'src/shared/domain/validator/validator-value-object';

export class MeasurementUnitActive {
  private readonly _value: boolean;

  constructor(value: boolean) {
    Validator.of(
      value,
      (msg) => new InvalidValueObjectException('MeasurementUnitActive', msg),
    )
      .boolean('Measurement unit active must be a boolean')
      .getValue();
    this._value = value;
  }

  public value(): boolean {
    return this._value;
  }

  public equals(other: MeasurementUnitActive): boolean {
    return this._value === other.value();
  }
}
