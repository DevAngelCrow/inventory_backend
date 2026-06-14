import { InvalidValueObjectException } from 'src/shared/domain/exceptions/invalid-value-object.exception';
import { Validator } from 'src/shared/domain/validator/validator-value-object';

export class GeographicDivisionDescription {
  private readonly _value: string | undefined;

  constructor(value?: string) {
    if (value === undefined || value === null) {
      this._value = undefined;
      return;
    }
    this._value = Validator.of(
      value,
      (msg) =>
        new InvalidValueObjectException('GeographicDivisionDescription', msg),
    )
      .string('GeographicDivision description must be a string')
      .maxLength(
        200,
        'GeographicDivision description must be at most 200 characters long',
      )
      .getValue();
  }

  public value(): string | undefined {
    return this._value;
  }
}
