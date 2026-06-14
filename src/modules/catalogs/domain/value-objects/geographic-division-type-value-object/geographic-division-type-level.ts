import { InvalidValueObjectException } from 'src/shared/domain/exceptions/invalid-value-object.exception';
import { Validator } from 'src/shared/domain/validator/validator-value-object';

export class GeographicDivisionTypeLevel {
  private readonly _value: number;

  constructor(value: number) {
    this._value = Validator.of(
      value,
      (msg) =>
        new InvalidValueObjectException('GeographicDivisionTypeLevel', msg),
    )
      .required('GeographicDivisionType level is required')
      .number('GeographicDivisionType level must be a number')
      .getValue();
  }

  public value(): number {
    return this._value;
  }
}
