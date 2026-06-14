import { InvalidValueObjectException } from 'src/shared/domain/exceptions/invalid-value-object.exception';
import { Validator } from 'src/shared/domain/validator/validator-value-object';

export class AddressIdMunicipality {
  private readonly _value: string;

  constructor(value: string) {
    this._value = Validator.of(
      value,
      (msg) => new InvalidValueObjectException('AddressIdMunicipality', msg),
    )
      .required('Address id municipality is required')
      .uuid('Address id municipality Must be a valid UUID')
      .getValue();
  }

  public value(): string {
    return this._value;
  }

  public equals(other: AddressIdMunicipality): boolean {
    return this._value === other._value;
  }

  public toString(): string {
    return this._value.toString();
  }
}
