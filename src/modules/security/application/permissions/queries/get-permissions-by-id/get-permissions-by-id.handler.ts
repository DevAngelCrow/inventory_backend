import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetPermissionsByIdQuery } from './get-permissions-by-id.query';
import { PermissionsReadRepository } from '../../../repositories/permissions-read.repository';

@QueryHandler(GetPermissionsByIdQuery)
export class GetPermissionsByIdHandler implements IQueryHandler<GetPermissionsByIdQuery> {
  constructor(private readonly repository: PermissionsReadRepository) {}

  async execute(query: GetPermissionsByIdQuery) {
    return await this.repository.getOneById(query.id);
  }
}
