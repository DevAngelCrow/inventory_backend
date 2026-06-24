import { InvalidValueObjectException } from 'src/shared/domain/exceptions/invalid-value-object.exception';
import { Validator } from 'src/shared/domain/validator/validator-value-object';

export class MaintenanceId {
  private readonly _value: string;

  constructor(value: string) {
    this._value = Validator.of(
      value,
      (msg) => new InvalidValueObjectException('MaintenanceId', msg),
    )
      .required('Maintenance ID is required')
      .uuid('Maintenance ID must be a valid UUID')
      .getValue();
  }

  public value(): string {
    return this._value;
  }

  public equals(other: MaintenanceId): boolean {
    return this._value === other._value;
  }

  public toString(): string {
    return this._value;
  }
}
