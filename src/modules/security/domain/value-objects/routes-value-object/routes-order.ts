import { InvalidValueObjectException } from 'src/shared/domain/exceptions/invalid-value-object.exception';
import { Validator } from 'src/shared/domain/validator/validator-value-object';

export class RoutesOrder {
  private readonly _value: number;

  constructor(value: number) {
    this._value = Validator.of(
      value,
      (msg) => new InvalidValueObjectException('RoutesOrder', msg),
    )
      .required('Routes order is required')
      .positiveInteger('Routes order must be a positive integer')
      .getValue();
  }

  public value(): number {
    return this._value;
  }

  public equals(other: RoutesOrder): boolean {
    return this._value === other._value;
  }

  public toString(): string {
    return this._value.toString();
  }
}
