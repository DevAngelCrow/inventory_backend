export class CheckAvailabilityQuery {
  constructor(
    public readonly productId: string,
    public readonly quantity: number,
    public readonly dateStart: Date,
    public readonly dateEnd: Date,
  ) {}
}
