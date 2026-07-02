export class ReservationCreatedEvent {
  constructor(
    public readonly reservationId: string,
    public readonly customerId: string,
    public readonly totalAmount: number,
  ) {}
}
