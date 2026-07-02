import { InvalidValueObjectException } from 'src/shared/domain/exceptions/invalid-value-object.exception';
import { Validator } from 'src/shared/domain/validator/validator-value-object';

export class MaintenanceDateStart {
  private readonly _value: Date;

  constructor(value: Date) {
    this._value = Validator.of(
      value,
      (msg) => new InvalidValueObjectException('MaintenanceDateStart', msg),
    )
      .required('Maintenance start date is required')
      .date('Maintenance start date must be a valid date')
      .getValue();
  }

  public value(): Date {
    return this._value;
  }

  public equals(other: MaintenanceDateStart): boolean {
    return this._value.getTime() === other._value.getTime();
  }
}
