import { ReservationId } from '../value-objects/reservation-id';
import { ReservationStatus } from '../value-objects/reservation-status';
import { ReservationDateRange } from '../value-objects/reservation-date-range';
import { ReservationAddress } from '../value-objects/reservation-address';
import { ReservationAmount } from '../value-objects/reservation-amount';
import { ReservationNotes } from '../value-objects/reservation-notes';
import { ReservationItem } from './reservation-item';
import { ReservationCustomerId } from '../value-objects/reservation-customer-id';
import { ReservationDeliveryDatetime } from '../value-objects/reservation-delivery-datetime';
import { ReservationPickupDatetime } from '../value-objects/reservation-pickup-datetime';

export class Reservation {
  constructor(
    private readonly id_customer: ReservationCustomerId,
    private readonly status: ReservationStatus,
    private readonly dateRange: ReservationDateRange,
    private readonly deliveryAddress: ReservationAddress,
    private readonly amount: ReservationAmount,
    private readonly notes: ReservationNotes,
    private readonly items: ReservationItem[],
    private readonly deliveryDatetime?: ReservationDeliveryDatetime,
    private readonly pickupDatetime?: ReservationPickupDatetime,
    private readonly id?: ReservationId,
  ) {}

  static create(data: {
    id_customer: string;
    status: string;
    event_start: Date;
    event_end: Date;
    delivery_address?: string;
    delivery_address_line2?: string;
    delivery_zip?: string;
    delivery_notes?: string;
    id_customer_address?: string;
    id_geographic_division?: string;
    total_amount: number;
    deposit_amount?: number;
    balance_due?: number;
    notes?: string;
    items: {
      id_product: string;
      quantity: number;
      unit_price: number;
      total_price: number;
      id?: string;
    }[];
    delivery_datetime?: Date;
    pickup_datetime?: Date;
    id?: string;
  }): Reservation {
    return new Reservation(
      new ReservationCustomerId(data.id_customer),
      new ReservationStatus(data.status),
      new ReservationDateRange(data.event_start, data.event_end),
      new ReservationAddress({
        addressLine1: data.delivery_address,
        addressLine2: data.delivery_address_line2,
        zip: data.delivery_zip,
        notes: data.delivery_notes,
        idCustomerAddress: data.id_customer_address,
        idGeographicDivision: data.id_geographic_division,
      }),
      new ReservationAmount(
        data.total_amount,
        data.deposit_amount,
        data.balance_due,
      ),
      new ReservationNotes(data.notes),
      data.items.map((i) =>
        ReservationItem.create({
          id_product: i.id_product,
          quantity: i.quantity,
          unit_price: i.unit_price,
          total_price: i.total_price,
          id_reservation: data.id,
          id: i.id,
        }),
      ),
      data.delivery_datetime
        ? new ReservationDeliveryDatetime(data.delivery_datetime)
        : undefined,
      data.pickup_datetime
        ? new ReservationPickupDatetime(data.pickup_datetime)
        : undefined,
      data.id ? new ReservationId(data.id) : undefined,
    );
  }

  public getId(): ReservationId | undefined {
    return this.id;
  }
  public getIdCustomer(): ReservationCustomerId {
    return this.id_customer;
  }
  public getStatus(): ReservationStatus {
    return this.status;
  }
  public getDateRange(): ReservationDateRange {
    return this.dateRange;
  }
  public getDeliveryAddress(): ReservationAddress {
    return this.deliveryAddress;
  }
  public getAmount(): ReservationAmount {
    return this.amount;
  }
  public getNotes(): ReservationNotes {
    return this.notes;
  }
  public getItems(): ReservationItem[] {
    return this.items;
  }
  public getDeliveryDatetime(): ReservationDeliveryDatetime | undefined {
    return this.deliveryDatetime;
  }
  public getPickupDatetime(): ReservationPickupDatetime | undefined {
    return this.pickupDatetime;
  }
}
