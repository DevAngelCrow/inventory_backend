import { InvalidValueObjectException } from '@/shared/domain/exceptions/invalid-value-object.exception';
import { Validator } from '@/shared/domain/validator/validator-value-object';

export class PaymentAmount {
  private readonly _value: number;

  constructor(value: number) {
    this._value = Validator.of(
      value,
      (msg) => new InvalidValueObjectException('PaymentAmount', msg),
    )
      .required()
      .number()
      .min(0, 'Payment amount cannot be negative')
      .getValue();
  }

  public value(): number {
    return this._value;
  }
}
