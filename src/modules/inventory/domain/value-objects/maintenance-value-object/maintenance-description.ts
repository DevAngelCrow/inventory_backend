import { InvalidValueObjectException } from 'src/shared/domain/exceptions/invalid-value-object.exception';
import { Validator } from 'src/shared/domain/validator/validator-value-object';

export class MaintenanceDescription {
  private readonly _value: string;

  constructor(value: string) {
    this._value = Validator.of(
      value,
      (msg) => new InvalidValueObjectException('MaintenanceDescription', msg),
    )
      .required('Maintenance description is required')
      .string('Maintenance description must be a string')
      .maxLength(1000, 'Maintenance description must be at most 1000 characters long')
      .getValue();
  }

  public value(): string {
    return this._value;
  }

  public equals(other: MaintenanceDescription): boolean {
    return this._value === other._value;
  }

  public toString(): string {
    return this._value;
  }
}
