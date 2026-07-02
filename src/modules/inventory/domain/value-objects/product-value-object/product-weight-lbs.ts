import { InvalidValueObjectException } from 'src/shared/domain/exceptions/invalid-value-object.exception';
import { Validator } from 'src/shared/domain/validator/validator-value-object';

export class ProductWeightLbs {
  private readonly _value: number | undefined;

  constructor(value?: number) {
    if (value !== undefined && value !== null) {
      Validator.of(
        value,
        (msg) => new InvalidValueObjectException('ProductWeightLbs', msg),
      )
        .number('Product weight must be a number')
        .min(0, 'Product weight must be positive')
        .getValue();
    }
    this._value = value;
  }

  public value(): number | undefined {
    return this._value;
  }

  public equals(other: ProductWeightLbs): boolean {
    return this._value === other._value;
  }

  public toNumber(): number | undefined {
    return this._value;
  }
}
