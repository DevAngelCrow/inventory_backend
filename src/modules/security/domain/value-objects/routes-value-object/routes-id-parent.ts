import { InvalidValueObjectException } from 'src/shared/domain/exceptions/invalid-value-object.exception';
import { Validator } from 'src/shared/domain/validator/validator-value-object';

export class RoutesIdParent {
  private readonly _value: string;

  constructor(value: string) {
    this._value = Validator.of(
      value,
      (msg) => new InvalidValueObjectException('RoutesIdParent', msg),
    )
      .required('Routes id parent is required')
      .uuid('Routes id parent Must be a valid UUID')
      .getValue();
  }

  public value(): string {
    return this._value;
  }

  public equals(other: RoutesIdParent): boolean {
    return this._value === other._value;
  }

  public toString(): string {
    return this._value.toString();
  }
}
