import { InvalidValueObjectException } from 'src/shared/domain/exceptions/invalid-value-object.exception';
import { Validator } from 'src/shared/domain/validator/validator-value-object';

export class AddressIdGeographicDivision {
  private readonly _value: string | null;

  constructor(value: string | null | undefined) {
    if (value === null || value === undefined || value === '') {
      this._value = null;
      return;
    }
    this._value = Validator.of(
      value,
      (msg) => new InvalidValueObjectException('AddressIdDistrict', msg),
    )
      .uuid('Address id district Must be a valid UUID')
      .getValue();
  }

  public value(): string | null {
    return this._value;
  }

  public equals(other: AddressIdGeographicDivision): boolean {
    return this._value === other._value;
  }

  public toString(): string {
    return this._value?.toString() ?? '';
  }
}
