import { InvalidValueObjectException } from 'src/shared/domain/exceptions/invalid-value-object.exception';
import { Validator } from 'src/shared/domain/validator/validator-value-object';

export class PermissionsIdCategoryPermissions {
  private readonly _value: string;

  constructor(value: string) {
    this._value = Validator.of(
      value,
      (msg) =>
        new InvalidValueObjectException(
          'PermissionsIdCategoryPermissions',
          msg,
        ),
    )
      .required('Permissions id category permissions is required')
      .uuid('Permissions id category permissions Must be a valid UUID')
      .getValue();
  }

  public value(): string {
    return this._value;
  }

  public equals(other: PermissionsIdCategoryPermissions): boolean {
    return this._value === other._value;
  }

  public toString(): string {
    return this._value.toString();
  }
}
