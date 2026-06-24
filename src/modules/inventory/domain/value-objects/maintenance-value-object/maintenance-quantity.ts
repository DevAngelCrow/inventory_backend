import { InvalidValueObjectException } from 'src/shared/domain/exceptions/invalid-value-object.exception';
import { Validator } from 'src/shared/domain/validator/validator-value-object';

export class MaintenanceQuantity {
  private readonly _value: number;

  constructor(value: number) {
    this._value = Validator.of(
      value,
      (msg) => new InvalidValueObjectException('MaintenanceQuantity', msg),
    )
      .required('Maintenance quantity is required')
      .number('Maintenance quantity must be a number')
      .min(1, 'Maintenance quantity must be at least 1')
      .getValue();
  }

  public value(): number {
    return this._value;
  }

  public equals(other: MaintenanceQuantity): boolean {
    return this._value === other._value;
  }

  public toNumber(): number {
    return this._value;
  }
}
