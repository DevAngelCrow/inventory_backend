export class ReservationItemDto {
  constructor(
    public readonly id_product: string,
    public readonly quantity: number,
    public readonly unit_price: number,
    public readonly total_price: number,
    public readonly id_reservation?: string,
    public readonly id?: string,
  ) {}
}

export class ReservationDto {
  constructor(
    public readonly id_customer: string,
    public readonly status: string,
    public readonly event_start: Date,
    public readonly event_end: Date,
    public readonly total_amount: number,
    public readonly delivery_address?: string,
    public readonly deposit_amount?: number,
    public readonly balance_due?: number,
    public readonly notes?: string,
    public readonly items: ReservationItemDto[] = [],
    public readonly id?: string,
    public readonly created_at?: Date | null,
    public readonly updated_at?: Date | null,
  ) {}
}
