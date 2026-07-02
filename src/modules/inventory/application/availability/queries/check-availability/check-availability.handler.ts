import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { CheckAvailabilityQuery } from './check-availability.query';
import {
  AvailabilityRepository,
  AVAILABILITY_REPOSITORY,
} from '@/modules/inventory/domain/repositories/availability.repository';
import { Inject } from '@nestjs/common';

@QueryHandler(CheckAvailabilityQuery)
export class CheckAvailabilityHandler implements IQueryHandler<CheckAvailabilityQuery> {
  constructor(
    @Inject(AVAILABILITY_REPOSITORY)
    private readonly repository: AvailabilityRepository,
  ) {}

  async execute(query: CheckAvailabilityQuery): Promise<boolean> {
    return await this.repository.isAvailable(
      query.productId,
      query.quantity,
      query.dateStart,
      query.dateEnd,
    );
  }
}
