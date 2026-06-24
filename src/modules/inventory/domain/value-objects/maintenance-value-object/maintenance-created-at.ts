import { InvalidValueObjectException } from 'src/shared/domain/exceptions/invalid-value-object.exception';
import { Validator } from 'src/shared/domain/validator/validator-value-object';

export class MaintenanceCreatedAt {
  private readonly _value: Date;

  constructor(value: Date) {
    this._value = Validator.of(
      value,
      (msg) => new InvalidValueObjectException('MaintenanceCreatedAt', msg),
    )
      .required('Maintenance created at is required')
      .date('Maintenance created at must be a valid date')
      .getValue();
  }

  public value(): Date {
    return this._value;
  }

  public equals(other: MaintenanceCreatedAt): boolean {
    return this._value.getTime() === other._value.getTime();
  }
}
