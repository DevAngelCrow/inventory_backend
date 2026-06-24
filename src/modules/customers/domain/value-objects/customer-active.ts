import { InvalidValueObjectException } from '@/shared/domain/exceptions/invalid-value-object.exception';
import { Validator } from '@/shared/domain/validator/validator-value-object';

export class CustomerActive {
  private readonly _value: boolean;

  constructor(value: boolean) {
    this._value = Validator.of(
      value,
      (msg) => new InvalidValueObjectException('CustomerActive', msg),
    )
      .required('Active flag is required')
      .getValue();
  }

  public value(): boolean {
    return this._value;
  }
}
