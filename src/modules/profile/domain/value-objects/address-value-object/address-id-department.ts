import { InvalidValueObjectException } from 'src/shared/domain/exceptions/invalid-value-object.exception';
import { Validator } from 'src/shared/domain/validator/validator-value-object';

export class AddressIdDepartment {
  private readonly _value: string;

  constructor(value: string) {
    this._value = Validator.of(
      value,
      (msg) => new InvalidValueObjectException('AddressIdDepartment', msg),
    )
      .required('Address id department is required')
      .uuid('Address id department Must be a valid UUID')
      .getValue();
  }

  public value(): string {
    return this._value;
  }

  public equals(other: AddressIdDepartment): boolean {
    return this._value === other._value;
  }

  public toString(): string {
    return this._value.toString();
  }
}
