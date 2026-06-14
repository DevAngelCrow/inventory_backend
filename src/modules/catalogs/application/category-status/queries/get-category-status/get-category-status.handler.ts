import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCategoryStatusQuery } from './get-category-status.query';
import { NotFoundException } from '@/shared/domain/exceptions/not-found.exception';
import { CategoryStatusQueriesRepository } from '../../../repositories/category-status-read.repository';
import { CategoryStatusDto } from '../../../dtos/category-status.dto';

@QueryHandler(GetCategoryStatusQuery)
export class GetCategoryStatusHandler implements IQueryHandler<GetCategoryStatusQuery> {
  constructor(private readonly repository: CategoryStatusQueriesRepository) {}

  async execute(
    query: GetCategoryStatusQuery,
  ): Promise<CategoryStatusDto | null> {
    const categoryStatusId = query.id_category_status;
    const categoryStatus = await this.repository.getOneById(categoryStatusId);
    if (!categoryStatus) {
      throw new NotFoundException(
        'CategoryStatus',
        query.id_category_status.toString(),
      );
    }
    return categoryStatus;
  }
}
