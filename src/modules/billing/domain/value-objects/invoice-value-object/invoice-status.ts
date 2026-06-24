import { InvalidValueObjectException } from '@/shared/domain/exceptions/invalid-value-object.exception';
import { Validator } from '@/shared/domain/validator/validator-value-object';

export type InvoiceStatusType = 'DRAFT' | 'ISSUED' | 'PAID' | 'VOIDED';

export class InvoiceStatus {
  private readonly _value: InvoiceStatusType;
  private readonly allowedStatuses: InvoiceStatusType[] = [
    'DRAFT', 'ISSUED', 'PAID', 'VOIDED'
  ];

  constructor(value: string) {
    this._value = Validator.of(
      value,
      (msg) => new InvalidValueObjectException('InvoiceStatus', msg),
    )
      .required('Status is required')
      .string('Status must be a string')
      .custom((v) => this.allowedStatuses.includes(v as InvoiceStatusType), 'Invalid status value')
      .getValue() as InvoiceStatusType;
  }

  public value(): InvoiceStatusType {
    return this._value;
  }
}
