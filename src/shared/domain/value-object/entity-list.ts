import { InvalidValueObjectException } from '../exceptions/invalid-value-object.exception';
import { Validator } from '../validator/validator-value-object';

export class EntityList<T> {
  private readonly _value: T[];
  constructor(value: T[]) {
    const createException = (msg: string): InvalidValueObjectException =>
      new InvalidValueObjectException('Entity List', msg);

    this._value = Validator.of(value, createException)
      //.required('Entity List is required')
      .array('Entity List must be an array')
      .getValue();
  }
  public value(): T[] {
    return this._value;
  }
}
