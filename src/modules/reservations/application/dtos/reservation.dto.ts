export class ReservationItemDto {
  constructor(
    public readonly id_product: string,
    public readonly quantity: number,
    public readonly unit_price: number,
    public readonly total_price: number,
    public readonly id_reservation?: string,
    public readonly id?: string,
    public readonly mnt_product?: {
      name: string;
      sku: string;
    },
  ) {}
}

export class ReservationDto {
  constructor(
    public readonly id_customer: string,
    public readonly status: {
      id: string;
      code: string;
      name: string;
      state_color: string;
      text_color: string;
    },
    public readonly event_start: Date,
    public readonly event_end: Date,
    public readonly total_amount: number,
    public readonly delivery_address?: string,
    public readonly delivery_address_line2?: string,
    public readonly delivery_zip?: string,
    public readonly delivery_notes?: string,
    public readonly id_customer_address?: string,
    public readonly id_geographic_division?: string,
    public readonly geographic_division_name?: string,
    public readonly deposit_amount?: number,
    public readonly balance_due?: number,
    public readonly delivery_fee?: number,
    public readonly discount_amount?: number,
    public readonly notes?: string,
    public readonly items: ReservationItemDto[] = [],
    public readonly id?: string,
    public readonly created_at?: Date | null,
    public readonly updated_at?: Date | null,
    public readonly reservation_number?: string,
    public readonly delivery_datetime?: Date | null,
    public readonly pickup_datetime?: Date | null,
    public readonly transit_time_minutes?: number,
    public readonly mnt_customer?: {
      first_name: string;
      last_name: string;
      email?: string | null;
      phone?: string | null;
    },
  ) {}
}
