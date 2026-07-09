export const AVAILABILITY_REPOSITORY = 'AVAILABILITY_REPOSITORY';

export interface AvailabilityRepository {
  getAvailableStock(
    productId: string,
    dateStart: Date,
    dateEnd: Date,
    excludeReservationId?: string,
  ): Promise<number>;

  isAvailable(
    productId: string,
    quantity: number,
    dateStart: Date,
    dateEnd: Date,
    excludeReservationId?: string,
  ): Promise<boolean>;
}
