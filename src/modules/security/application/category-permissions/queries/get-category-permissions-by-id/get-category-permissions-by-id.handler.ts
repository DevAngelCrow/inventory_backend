import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCategoryPermissionsByIdQuery } from './get-category-permissions-by-id.query';
import { CategoryPermissionsReadRepository } from '../../../repositories/category-permissions-read.repository';

@QueryHandler(GetCategoryPermissionsByIdQuery)
export class GetCategoryPermissionsByIdHandler implements IQueryHandler<GetCategoryPermissionsByIdQuery> {
  constructor(private readonly repository: CategoryPermissionsReadRepository) {}

  async execute(query: GetCategoryPermissionsByIdQuery) {
    return await this.repository.getOneById(query.id);
  }
}
