import { InvalidValueObjectException } from '@/shared/domain/exceptions/invalid-value-object.exception';
import { Validator } from '@/shared/domain/validator/validator-value-object';

export class MenuParent<T> {
  private readonly _value: T;
  constructor(value: T) {
    const createException = (msg: string): InvalidValueObjectException =>
      new InvalidValueObjectException('menu parent', msg);
    this._value = Validator.of(value, createException).getValue();
  }
  public value(): T {
    return this._value;
  }

  public equals(other: MenuParent<T>): boolean {
    return this._value === other._value;
  }
}
