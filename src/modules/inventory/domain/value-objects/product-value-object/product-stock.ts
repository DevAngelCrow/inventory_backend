import { InvalidValueObjectException } from '@/shared/domain/exceptions/invalid-value-object.exception';
import { Validator } from '@/shared/domain/validator/validator-value-object';

export class ProductStock {
  private readonly _value: number;

  constructor(value: number) {
    this._value = Validator.of(
      value,
      (msg) => new InvalidValueObjectException('ProductStock', msg),
    )
      .number()
      .min(0, 'Product stock cannot be negative')
      .getValue();
  }

  public value(): number {
    return this._value;
  }
}
