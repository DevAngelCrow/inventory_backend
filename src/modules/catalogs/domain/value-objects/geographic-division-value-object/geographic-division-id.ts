import { InvalidValueObjectException } from 'src/shared/domain/exceptions/invalid-value-object.exception';
import { Validator } from 'src/shared/domain/validator/validator-value-object';

export class GeographicDivisionId {
  private readonly _value: string;

  constructor(value: string) {
    this._value = Validator.of(
      value,
      (msg) => new InvalidValueObjectException('GeographicDivisionId', msg),
    )
      .required('GeographicDivision id is required')
      .uuid('GeographicDivision id must be a valid UUID')
      .getValue();
  }

  public value(): string {
    return this._value;
  }
}
