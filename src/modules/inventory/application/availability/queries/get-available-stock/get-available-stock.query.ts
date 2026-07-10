export class GetAvailableStockQuery {
  constructor(
    public readonly productId: string,
    public readonly dateStart: Date,
    public readonly dateEnd: Date,
    public readonly excludeReservationId?: string,
  ) {}
}
