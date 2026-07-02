import { InvalidValueObjectException } from '@/shared/domain/exceptions/invalid-value-object.exception';
import { Validator } from '@/shared/domain/validator/validator-value-object';

export class PaymentNotes {
  private readonly _value?: string;

  constructor(value?: string) {
    if (value !== undefined && value !== null) {
      this._value = Validator.of(
        value,
        (msg) => new InvalidValueObjectException('PaymentNotes', msg),
      )
        .string()
        .getValue();
    }
  }

  public value(): string | undefined {
    return this._value;
  }
}
