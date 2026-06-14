import { InvalidValueObjectException } from '../exceptions/invalid-value-object.exception';
import { Validator } from '../validator/validator-value-object';

export class Page {
  private readonly _value: number;
  constructor(value: number) {
    const createException = (msg: string): InvalidValueObjectException =>
      new InvalidValueObjectException('Page', msg);
    this._value = Validator.of(value, createException)
      .required('Page is required')
      .number('Page must be a number')
      .positiveInteger('Page must be a positive integer')
      .getValue();
  }
  public value(): number {
    return this._value;
  }
}
