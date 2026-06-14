import { InvalidValueObjectException } from 'src/shared/domain/exceptions/invalid-value-object.exception';
import { Validator } from 'src/shared/domain/validator/validator-value-object';

export class GeographicDivisionTypeIdCountry {
  private readonly _value: string;

  constructor(value: string) {
    this._value = Validator.of(
      value,
      (msg) =>
        new InvalidValueObjectException('GeographicDivisionTypeIdCountry', msg),
    )
      .required('GeographicDivisionType id_country is required')
      .uuid('GeographicDivisionType id_country must be a valid UUID')
      .getValue();
  }

  public value(): string {
    return this._value;
  }
}
