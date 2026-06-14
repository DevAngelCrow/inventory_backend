export class CreateReservationItemCommand {
  constructor(
    public readonly id_product: string,
    public readonly quantity: number,
    public readonly unit_price: number,
    public readonly total_price: number,
  ) {}
}

export class CreateReservationCommand {
  constructor(
    public readonly id_customer: string,
    public readonly event_start: Date,
    public readonly event_end: Date,
    public readonly total_amount: number,
    public readonly items: CreateReservationItemCommand[],
    public readonly delivery_address?: string,
    public readonly deposit_amount?: number,
    public readonly balance_due?: number,
    public readonly notes?: string,
  ) {}
}
