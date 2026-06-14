import { InvalidValueObjectException } from '@/shared/domain/exceptions/invalid-value-object.exception';
import { Validator } from '@/shared/domain/validator/validator-value-object';

export class PersonBirthdate {
  private readonly _value: Date;
  constructor(value: Date) {
    this._value = Validator.of(
      value,
      (msg) => new InvalidValueObjectException('PersonBirthdate', msg),
    )
      .required('Person birthdate is required')
      .date('Person birthdate must be a valid date')
      .getValue();
  }
  public value(): Date {
    return this._value;
  }
  public equals(other: PersonBirthdate): boolean {
    return this._value.getTime() === other._value.getTime();
  }
  public toString(): string {
    return this._value.toISOString();
  }
}
