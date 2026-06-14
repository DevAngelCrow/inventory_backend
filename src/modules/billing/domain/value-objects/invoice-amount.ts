import { InvalidValueObjectException } from '@/shared/domain/exceptions/invalid-value-object.exception';
import { Validator } from '@/shared/domain/validator/validator-value-object';

export class InvoiceAmount {
  constructor(
    public readonly subtotal: number,
    public readonly taxRate: number,
    public readonly taxAmount: number,
    public readonly discountAmount: number,
    public readonly deliveryFee: number,
    public readonly damageCharges: number,
    public readonly total: number,
  ) {
    if (subtotal < 0 || taxRate < 0 || taxAmount < 0 || discountAmount < 0 || deliveryFee < 0 || damageCharges < 0 || total < 0) {
      throw new InvalidValueObjectException('InvoiceAmount', 'Amounts cannot be negative');
    }
  }
}
