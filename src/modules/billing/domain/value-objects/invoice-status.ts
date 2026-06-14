import { InvalidValueObjectException } from '@/shared/domain/exceptions/invalid-value-object.exception';

export type InvoiceStatusType = 'DRAFT' | 'ISSUED' | 'PAID' | 'CANCELLED';

export class InvoiceStatus {
  private readonly _value: InvoiceStatusType;
  private readonly allowedStatuses: InvoiceStatusType[] = [
    'DRAFT', 'ISSUED', 'PAID', 'CANCELLED'
  ];

  constructor(value: string) {
    if (!this.allowedStatuses.includes(value as InvoiceStatusType)) {
      throw new InvalidValueObjectException('InvoiceStatus', 'Invalid status value');
    }
    this._value = value as InvoiceStatusType;
  }

  public value(): InvoiceStatusType {
    return this._value;
  }
}
