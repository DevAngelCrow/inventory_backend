import { InvalidValueObjectException } from 'src/shared/domain/exceptions/invalid-value-object.exception';
import { Validator } from 'src/shared/domain/validator/validator-value-object';

export class GeographicDivisionName {
  private readonly _value: string;

  constructor(value: string) {
    this._value = Validator.of(
      value,
      (msg) => new InvalidValueObjectException('GeographicDivisionName', msg),
    )
      .required('GeographicDivision name is required')
      .string('GeographicDivision name must be a string')
      .maxLength(
        150,
        'GeographicDivision name must be at most 150 characters long',
      )
      .getValue();
  }

  public value(): string {
    return this._value;
  }
}
