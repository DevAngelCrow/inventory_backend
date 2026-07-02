import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { GetAvailableStockQuery } from './get-available-stock.query';
import {
  AvailabilityRepository,
  AVAILABILITY_REPOSITORY,
} from '@/modules/inventory/domain/repositories/availability.repository';
import { Inject } from '@nestjs/common';

@QueryHandler(GetAvailableStockQuery)
export class GetAvailableStockHandler implements IQueryHandler<GetAvailableStockQuery> {
  constructor(
    @Inject(AVAILABILITY_REPOSITORY)
    private readonly repository: AvailabilityRepository,
  ) {}

  async execute(query: GetAvailableStockQuery): Promise<number> {
    return await this.repository.getAvailableStock(
      query.productId,
      query.dateStart,
      query.dateEnd,
    );
  }
}
