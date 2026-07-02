import { InvalidValueObjectException } from '@/shared/domain/exceptions/invalid-value-object.exception';
import { Validator } from '@/shared/domain/validator/validator-value-object';

export class ReservationItemPrice {
  private readonly _unitPrice: number;
  private readonly _totalPrice: number;

  constructor(unitPrice: number, totalPrice: number) {
    this._unitPrice = Validator.of(
      unitPrice,
      (msg) => new InvalidValueObjectException('ReservationItemUnitPrice', msg),
    )
      .required()
      .number()
      .min(0)
      .getValue();

    this._totalPrice = Validator.of(
      totalPrice,
      (msg) =>
        new InvalidValueObjectException('ReservationItemTotalPrice', msg),
    )
      .required()
      .number()
      .min(0)
      .getValue();
  }

  public get unitPrice(): number {
    return this._unitPrice;
  }
  public get totalPrice(): number {
    return this._totalPrice;
  }
}
