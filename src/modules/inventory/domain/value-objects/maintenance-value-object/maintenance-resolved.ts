import { InvalidValueObjectException } from 'src/shared/domain/exceptions/invalid-value-object.exception';
import { Validator } from 'src/shared/domain/validator/validator-value-object';

export class MaintenanceResolved {
  private readonly _value: boolean;

  constructor(value: boolean) {
    this._value = Validator.of(
      value,
      (msg) => new InvalidValueObjectException('MaintenanceResolved', msg),
    )
      .required('Maintenance resolved status is required')
      .boolean('Maintenance resolved status must be a boolean')
      .getValue();
  }

  public value(): boolean {
    return this._value;
  }

  public equals(other: MaintenanceResolved): boolean {
    return this._value === other._value;
  }
}
