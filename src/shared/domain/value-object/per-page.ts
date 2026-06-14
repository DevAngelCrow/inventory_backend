import { InvalidValueObjectException } from '../exceptions/invalid-value-object.exception';
import { Validator } from '../validator/validator-value-object';

export class PerPage {
  private readonly _value: number;
  constructor(value: number) {
    const createException = (msg: string): InvalidValueObjectException =>
      new InvalidValueObjectException('Per Page', msg);

    this._value = Validator.of(value, createException)
      .required('Per Page is required')
      .number('Per Page must be a number')
      .positiveInteger('Per Page must be a positive integer')
      .max(100, 'Per Page must be less than or equal to 100')
      .getValue();
  }
  public value(): number {
    return this._value;
  }
}
