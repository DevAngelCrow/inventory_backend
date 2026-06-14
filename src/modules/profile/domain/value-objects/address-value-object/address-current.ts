import { InvalidValueObjectException } from '@/shared/domain/exceptions/invalid-value-object.exception';
import { Validator } from '@/shared/domain/validator/validator-value-object';

export class AddressCurrent {
  private readonly _value: boolean;
  constructor(value: boolean) {
    this._value = Validator.of(
      value,
      (msg) => new InvalidValueObjectException('AddressCurrent', msg),
    )
      .boolean('Address current must be a boolean')
      .getValue();
  }
  public value(): boolean {
    return this._value;
  }
  public equals(other: AddressCurrent): boolean {
    return this._value === other._value;
  }
  public toString(): string {
    return this._value.toString();
  }
}
