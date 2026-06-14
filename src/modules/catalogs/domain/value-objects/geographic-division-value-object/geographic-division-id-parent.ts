import { InvalidValueObjectException } from 'src/shared/domain/exceptions/invalid-value-object.exception';
import { Validator } from 'src/shared/domain/validator/validator-value-object';

export class GeographicDivisionIdParent {
  private readonly _value: string | undefined;

  constructor(value?: string) {
    if (value === undefined || value === null) {
      this._value = undefined;
      return;
    }
    this._value = Validator.of(
      value,
      (msg) =>
        new InvalidValueObjectException('GeographicDivisionIdParent', msg),
    )
      .uuid('GeographicDivision id_parent must be a valid UUID')
      .getValue();
  }

  public value(): string | undefined {
    return this._value;
  }
}
