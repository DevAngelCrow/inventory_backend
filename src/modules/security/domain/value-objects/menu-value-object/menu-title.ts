import { InvalidValueObjectException } from '@/shared/domain/exceptions/invalid-value-object.exception';
import { Validator } from 'src/shared/domain/validator/validator-value-object';

export class MenuTitle {
  private readonly _value: string;

  constructor(value: string) {
    const createException = (msg: string): InvalidValueObjectException =>
      new InvalidValueObjectException('menu title', msg);

    this._value = Validator.of(value, createException)
      .required('Menu title is required')
      .string('Menu title must be a string')
      .minLength(2, 'Menu title must be at least 2 characters long')
      .maxLength(255, 'Menu title must be at most 255 characters long')
      .getValue();
  }
  public value(): string {
    return this._value;
  }
  public equals(other: MenuTitle): boolean {
    return this._value === other._value;
  }

  public toString(): string {
    return this._value.toString();
  }
}
