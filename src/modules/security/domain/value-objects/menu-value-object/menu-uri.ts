import { InvalidValueObjectException } from '@/shared/domain/exceptions/invalid-value-object.exception';
import { Validator } from 'src/shared/domain/validator/validator-value-object';

export class MenuUri {
  private readonly _value: string;

  constructor(value: string) {
    const createException = (msg: string): InvalidValueObjectException =>
      new InvalidValueObjectException('menu uri', msg);

    this._value = Validator.of(value, createException)
      .required('Menu uri is required')
      .string('Menu uri must be a string')
      //.minLength(2, 'Menu uri must be at least 2 characters long')
      .maxLength(255, 'Menu uri must be at most 255 characters long')
      .getValue();
  }
  public value(): string {
    return this._value;
  }
  public equals(other: MenuUri): boolean {
    return this._value === other._value;
  }

  public toString(): string {
    return this._value.toString();
  }
}
