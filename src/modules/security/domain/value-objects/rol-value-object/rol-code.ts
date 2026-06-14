import { InvalidValueObjectException } from '@/shared/domain/exceptions/invalid-value-object.exception';
import { Validator } from 'src/shared/domain/validator/validator-value-object';

export class RolCode {
  private readonly _value: string;

  constructor(value: string) {
    const createException = (msg: string): InvalidValueObjectException =>
      new InvalidValueObjectException('rol code', msg);

    this._value = Validator.of(value, createException)
      .required('Rol code is required')
      .string('Rol code must be a string')
      .minLength(2, 'Rol code must be at least 2 characters long')
      .maxLength(15, 'Rol code must be at most 15 characters long')
      .getValue();
  }
  public value(): string {
    return this._value;
  }
  public equals(other: RolCode): boolean {
    return this._value === other._value;
  }

  public toString(): string {
    return this._value.toString();
  }
}
