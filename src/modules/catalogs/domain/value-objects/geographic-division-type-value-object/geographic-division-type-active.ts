import { InvalidValueObjectException } from 'src/shared/domain/exceptions/invalid-value-object.exception';
import { Validator } from 'src/shared/domain/validator/validator-value-object';

export class GeographicDivisionTypeActive {
  private readonly _value: boolean;

  constructor(value: boolean) {
    this._value = Validator.of(
      value,
      (msg) =>
        new InvalidValueObjectException('GeographicDivisionTypeActive', msg),
    )
      .boolean('GeographicDivisionType active must be a boolean')
      .getValue();
  }

  public value(): boolean {
    return this._value;
  }
}
