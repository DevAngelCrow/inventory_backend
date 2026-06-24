import { InvalidValueObjectException } from 'src/shared/domain/exceptions/invalid-value-object.exception';
import { Validator } from 'src/shared/domain/validator/validator-value-object';

export class MaintenanceCost {
  private readonly _value: number | null;

  constructor(value: number | null) {
    if (value !== null && value !== undefined) {
      Validator.of(
        value,
        (msg) => new InvalidValueObjectException('MaintenanceCost', msg),
      )
        .number('Maintenance cost must be a number')
        .min(0, 'Maintenance cost must be positive')
        .getValue();
    }
    this._value = value;
  }

  public value(): number | null {
    return this._value;
  }

  public equals(other: MaintenanceCost): boolean {
    return this._value === other._value;
  }

  public toNumber(): number | null {
    return this._value;
  }
}
