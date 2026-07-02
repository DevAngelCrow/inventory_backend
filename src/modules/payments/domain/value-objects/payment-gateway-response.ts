import { InvalidValueObjectException } from '@/shared/domain/exceptions/invalid-value-object.exception';
import { Validator } from '@/shared/domain/validator/validator-value-object';

export class PaymentGatewayResponse {
  private readonly _value?: any;

  constructor(value?: any) {
    if (value !== undefined && value !== null) {
      this._value = Validator.of(
        value,
        (msg) => new InvalidValueObjectException('PaymentGatewayResponse', msg),
      ).getValue();
    }
  }

  public value(): any {
    return this._value;
  }
}
