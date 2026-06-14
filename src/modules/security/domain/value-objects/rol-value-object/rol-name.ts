import { InvalidValueObjectException } from '@/shared/domain/exceptions/invalid-value-object.exception';
import { Validator } from 'src/shared/domain/validator/validator-value-object';

export class RolName {
  private readonly _value: string;

  constructor(value: string) {
    const createException = (msg: string): InvalidValueObjectException =>
      new InvalidValueObjectException('rol names', msg);

    this._value = Validator.of(value, createException)
      .required('Rol name is required')
      .string('Rol name must be a string')
      .minLength(2, 'Rol name must be at least 2 characters long')
      .maxLength(255, 'Rol name must be at most 255 characters long')
      .getValue();
  }
  public value(): string {
    return this._value;
  }
  public equals(other: RolName): boolean {
    return this._value === other._value;
  }

  public toString(): string {
    return this._value.toString();
  }
}
