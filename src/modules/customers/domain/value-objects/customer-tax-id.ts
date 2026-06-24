import { InvalidValueObjectException } from '@/shared/domain/exceptions/invalid-value-object.exception';
import { Validator } from '@/shared/domain/validator/validator-value-object';

export class CustomerTaxId {
  private readonly _value: string;

  constructor(value: string) {
    this._value = Validator.of(
      value,
      (msg) => new InvalidValueObjectException('CustomerTaxId', msg),
    )
      .required('Tax ID is required')
      .maxLength(50, 'Tax ID must not exceed 50 characters')
      .getValue();
  }

  public value(): string {
    return this._value;
  }
}
