import { InvalidValueObjectException } from 'src/shared/domain/exceptions/invalid-value-object.exception';
import { Validator } from 'src/shared/domain/validator/validator-value-object';

export class PersonIdStatus {
  private readonly _value: string;

  constructor(value: string) {
    this._value = Validator.of(
      value,
      (msg) => new InvalidValueObjectException('PersonIdStatus', msg),
    )
      .required('Person id status is required')
      .uuid('Person id status Must be a valid UUID')
      .getValue();
  }

  public value(): string {
    return this._value;
  }

  public equals(other: PersonIdStatus): boolean {
    return this._value === other._value;
  }

  public toString(): string {
    return this._value.toString();
  }
}
