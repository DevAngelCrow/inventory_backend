import { InvalidValueObjectException } from '@/shared/domain/exceptions/invalid-value-object.exception';
import { Validator } from '@/shared/domain/validator/validator-value-object';

export class PaymentGatewayTxId {
  private readonly _value?: string;

  constructor(value?: string) {
    if (value !== undefined && value !== null) {
      this._value = Validator.of(
        value,
        (msg) => new InvalidValueObjectException('PaymentGatewayTxId', msg),
      )
        .string()
        .minLength(1)
        .getValue();
    }
  }

  public value(): string | undefined {
    return this._value;
  }
}
