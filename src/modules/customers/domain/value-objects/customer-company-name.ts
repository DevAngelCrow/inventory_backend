import { InvalidValueObjectException } from '@/shared/domain/exceptions/invalid-value-object.exception';
import { Validator } from '@/shared/domain/validator/validator-value-object';

export class CustomerCompanyName {
  private readonly _value: string;

  constructor(value: string) {
    this._value = Validator.of(
      value,
      (msg) => new InvalidValueObjectException('CustomerCompanyName', msg),
    )
      .required('Company name is required')
      .maxLength(150, 'Company name must not exceed 150 characters')
      .getValue();
  }

  public value(): string {
    return this._value;
  }
}
