import { ReservationItemId } from '../value-objects/reservation-item-id';
import { ReservationItemQuantity } from '../value-objects/reservation-item-quantity';
import { ReservationItemPrice } from '../value-objects/reservation-item-price';

export class ReservationItem {
  constructor(
    private readonly id_product: string,
    private readonly quantity: ReservationItemQuantity,
    private readonly price: ReservationItemPrice,
    private readonly id_reservation?: string,
    private readonly id?: ReservationItemId,
  ) {}

  static create(data: {
    id_product: string;
    quantity: number;
    unit_price: number;
    total_price: number;
    id_reservation?: string;
    id?: string;
  }): ReservationItem {
    return new ReservationItem(
      data.id_product,
      new ReservationItemQuantity(data.quantity),
      new ReservationItemPrice(data.unit_price, data.total_price),
      data.id_reservation,
      data.id ? new ReservationItemId(data.id) : undefined,
    );
  }

  public getId(): ReservationItemId | undefined { return this.id; }
  public getIdReservation(): string | undefined { return this.id_reservation; }
  public getIdProduct(): string { return this.id_product; }
  public getQuantity(): ReservationItemQuantity { return this.quantity; }
  public getPrice(): ReservationItemPrice { return this.price; }
}
