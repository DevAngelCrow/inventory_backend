import { InvalidValueObjectException } from '@/shared/domain/exceptions/invalid-value-object.exception';
import { Validator } from '@/shared/domain/validator/validator-value-object';

export class InvoiceAmount {
  public readonly subtotal: number;
  public readonly taxRate: number;
  public readonly taxAmount: number;
  public readonly discountAmount: number;
  public readonly deliveryFee: number;
  public readonly damageCharges: number;
  public readonly total: number;

  constructor(
    subtotal: number,
    taxRate: number,
    taxAmount: number,
    discountAmount: number,
    deliveryFee: number,
    damageCharges: number,
    total: number,
  ) {
    const errorFn = (msg: string) =>
      new InvalidValueObjectException('InvoiceAmount', msg);

    this.subtotal = Validator.of(subtotal, errorFn)
      .required()
      .number()
      .min(0, 'Subtotal cannot be negative')
      .getValue();
    this.taxRate = Validator.of(taxRate, errorFn)
      .required()
      .number()
      .min(0, 'Tax rate cannot be negative')
      .getValue();
    this.taxAmount = Validator.of(taxAmount, errorFn)
      .required()
      .number()
      .min(0, 'Tax amount cannot be negative')
      .getValue();
    this.discountAmount = Validator.of(discountAmount, errorFn)
      .required()
      .number()
      .min(0, 'Discount amount cannot be negative')
      .getValue();
    this.deliveryFee = Validator.of(deliveryFee, errorFn)
      .required()
      .number()
      .min(0, 'Delivery fee cannot be negative')
      .getValue();
    this.damageCharges = Validator.of(damageCharges, errorFn)
      .required()
      .number()
      .min(0, 'Damage charges cannot be negative')
      .getValue();
    this.total = Validator.of(total, errorFn)
      .required()
      .number()
      .min(0, 'Total cannot be negative')
      .getValue();
  }
}
