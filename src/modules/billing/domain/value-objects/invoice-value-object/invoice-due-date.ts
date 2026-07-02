import { InvalidValueObjectException } from '@/shared/domain/exceptions/invalid-value-object.exception';
import { Validator } from '@/shared/domain/validator/validator-value-object';

export class InvoiceDueDate {
  private readonly _value: Date;

  constructor(value: Date | string | number) {
    this._value = Validator.of(
      value,
      (msg) => new InvalidValueObjectException('InvoiceDueDate', msg),
    )
      .required('Due date is required')
      .date('Due date must be a valid date')
      .getValue() as Date;
  }

  public value(): Date {
    return this._value;
  }
}
