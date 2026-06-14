import { InvalidValueObjectException } from 'src/shared/domain/exceptions/invalid-value-object.exception';
import { Validator } from 'src/shared/domain/validator/validator-value-object';

export class GeographicDivisionIdCountry {
  private readonly _value: string;

  constructor(value: string) {
    this._value = Validator.of(
      value,
      (msg) =>
        new InvalidValueObjectException('GeographicDivisionIdCountry', msg),
    )
      .required('GeographicDivision id_country is required')
      .uuid('GeographicDivision id_country must be a valid UUID')
      .getValue();
  }

  public value(): string {
    return this._value;
  }
}
