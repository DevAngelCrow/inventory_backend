import { InvalidValueObjectException } from 'src/shared/domain/exceptions/invalid-value-object.exception';
import { Validator } from 'src/shared/domain/validator/validator-value-object';

export class CategoryPermissionsActive {
  private readonly _value: boolean;

  constructor(value: boolean) {
    this._value = Validator.of(
      value,
      (msg) =>
        new InvalidValueObjectException('CategoryPermissionsActive', msg),
    )
      .boolean('Category permissions active must be a boolean')
      .getValue();
  }

  public value(): boolean {
    return this._value;
  }

  public equals(other: CategoryPermissionsActive): boolean {
    return this._value === other._value;
  }

  public toString(): string {
    return this._value.toString();
  }
}
