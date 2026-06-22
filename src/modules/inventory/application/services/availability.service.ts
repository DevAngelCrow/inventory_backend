import { Injectable } from '@nestjs/common';
import { GetAvailableStockHandler } from '../availability/queries/get-available-stock/get-available-stock.handler';
import { CheckAvailabilityHandler } from '../availability/queries/check-availability/check-availability.handler';
import { GetAvailableStockQuery } from '../availability/queries/get-available-stock/get-available-stock.query';
import { CheckAvailabilityQuery } from '../availability/queries/check-availability/check-availability.query';

@Injectable()
export class AvailabilityService {
  constructor(
    private readonly getAvailableStockHandler: GetAvailableStockHandler,
    private readonly checkAvailabilityHandler: CheckAvailabilityHandler,
  ) {}

  /**
   * Checks if a product has enough available stock for a given date range.
   * This is a simplified check that subtracts the total quantity of items
   * reserved in overlapping date ranges from the total stock of the product.
   */
  async getAvailableStock(
    productId: string,
    dateStart: Date,
    dateEnd: Date,
  ): Promise<number> {
    const query = new GetAvailableStockQuery(productId, dateStart, dateEnd);
    return await this.getAvailableStockHandler.execute(query);
  }

  async isAvailable(
    productId: string,
    quantity: number,
    dateStart: Date,
    dateEnd: Date,
  ): Promise<boolean> {
    const query = new CheckAvailabilityQuery(productId, quantity, dateStart, dateEnd);
    return await this.checkAvailabilityHandler.execute(query);
  }
}
