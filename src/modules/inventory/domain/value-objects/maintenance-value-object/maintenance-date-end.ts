import { InvalidValueObjectException } from 'src/shared/domain/exceptions/invalid-value-object.exception';
import { Validator } from 'src/shared/domain/validator/validator-value-object';

export class MaintenanceDateEnd {
  private readonly _value: Date | null;

  constructor(value: Date | null) {
    if (value !== null && value !== undefined) {
      Validator.of(
        value,
        (msg) => new InvalidValueObjectException('MaintenanceDateEnd', msg),
      )
        .date('Maintenance end date must be a valid date')
        .getValue();
    }
    this._value = value;
  }

  public value(): Date | null {
    return this._value;
  }

  public equals(other: MaintenanceDateEnd): boolean {
    if (this._value === null && other._value === null) return true;
    if (this._value === null || other._value === null) return false;
    return this._value.getTime() === other._value.getTime();
  }
}
