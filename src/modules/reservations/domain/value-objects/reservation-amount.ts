import { InvalidValueObjectException } from '@/shared/domain/exceptions/invalid-value-object.exception';
import { Validator } from '@/shared/domain/validator/validator-value-object';

export class ReservationAmount {
  private readonly _total: number;
  private readonly _deposit: number | undefined;
  private readonly _balance: number | undefined;
  private readonly _deliveryFee: number;
  private readonly _discountAmount: number;

  constructor(
    total: number,
    deposit?: number,
    balance?: number,
    deliveryFee: number = 0,
    discountAmount: number = 0,
  ) {
    this._total = Validator.of(
      total,
      (msg) => new InvalidValueObjectException('ReservationTotalAmount', msg),
    )
      .required()
      .number()
      .min(0, 'Total amount cannot be negative')
      .getValue();

    if (deposit !== undefined && deposit !== null) {
      this._deposit = Validator.of(
        deposit,
        (msg) =>
          new InvalidValueObjectException('ReservationDepositAmount', msg),
      )
        .number()
        .min(0, 'Deposit amount cannot be negative')
        .getValue();
    } else {
      this._deposit = undefined;
    }

    if (balance !== undefined && balance !== null) {
      this._balance = Validator.of(
        balance,
        (msg) => new InvalidValueObjectException('ReservationBalanceDue', msg),
      )
        .number()
        .min(0, 'Balance due cannot be negative')
        .getValue();
    } else {
      this._balance = undefined;
    }

    this._deliveryFee = Validator.of(
      deliveryFee,
      (msg) => new InvalidValueObjectException('ReservationDeliveryFee', msg),
    )
      .number()
      .min(0, 'Delivery fee cannot be negative')
      .getValue();

    this._discountAmount = Validator.of(
      discountAmount,
      (msg) => new InvalidValueObjectException('ReservationDiscountAmount', msg),
    )
      .number()
      .min(0, 'Discount amount cannot be negative')
      .getValue();
  }

  public get total(): number {
    return this._total;
  }
  public get deposit(): number | undefined {
    return this._deposit;
  }
  public get balance(): number | undefined {
    return this._balance;
  }
  public get deliveryFee(): number {
    return this._deliveryFee;
  }
  public get discountAmount(): number {
    return this._discountAmount;
  }
}
