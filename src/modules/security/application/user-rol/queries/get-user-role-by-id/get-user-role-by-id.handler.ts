import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { UsersRoleReadRepository } from '../../../repositories/user-rol-read.repository';
import { GetUserRoleByIdQuery } from './get-user-role-by-id.query';

@QueryHandler(GetUserRoleByIdQuery)
export class GetUserRoleByIdHandler implements IQueryHandler<GetUserRoleByIdQuery> {
  constructor(private readonly repository: UsersRoleReadRepository) {}
  async execute(query: GetUserRoleByIdQuery) {
    return await this.repository.getUserRole(query.id);
  }
}
