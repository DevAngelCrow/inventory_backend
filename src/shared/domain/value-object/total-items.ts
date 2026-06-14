import { InvalidValueObjectException } from '../exceptions/invalid-value-object.exception';
import { Validator } from '../validator/validator-value-object';

export class TotalItems {
  private readonly _value: number;
  constructor(value: number) {
    const createException = (msg: string): InvalidValueObjectException =>
      new InvalidValueObjectException('Total Items', msg);
    this._value = Validator.of(value, createException)
      .required('Total Items is required')
      .number('Total Items must be a number')
      //.positiveInteger('Total Items must be a positive integer')
      .getValue();
  }
  public value(): number {
    return this._value;
  }
}
