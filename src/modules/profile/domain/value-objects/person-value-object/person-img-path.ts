import { InvalidValueObjectException } from 'src/shared/domain/exceptions/invalid-value-object.exception';
import { Validator } from 'src/shared/domain/validator/validator-value-object';

export class PersonImgPath {
  private readonly _value: string;

  constructor(value: string) {
    this._value = Validator.of(
      value,
      (msg) => new InvalidValueObjectException('PersonImgPath', msg),
    )
      .required('Person image path is required')
      .string('Person image path must be a string')
      .maxLength(255, 'Person image path must be at most 255 characters long')
      .getValue();
  }

  public value(): string {
    return this._value;
  }

  public equals(other: PersonImgPath): boolean {
    return this._value === other._value;
  }

  public toString(): string {
    return this._value;
  }
}
