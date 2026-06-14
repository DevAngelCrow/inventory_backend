import { InvalidValueObjectException } from 'src/shared/domain/exceptions/invalid-value-object.exception';
import { Validator } from 'src/shared/domain/validator/validator-value-object';

export class GeographicDivisionTypeId {
  private readonly _value: string;

  constructor(value: string) {
    this._value = Validator.of(
      value,
      (msg) => new InvalidValueObjectException('GeographicDivisionTypeId', msg),
    )
      .required('GeographicDivisionType id is required')
      .uuid('GeographicDivisionType id must be a valid UUID')
      .getValue();
  }

  public value(): string {
    return this._value;
  }
}
