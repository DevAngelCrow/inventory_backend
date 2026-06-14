import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetRolByIdQuery } from './get-rol-by-id.query';
import { RolReadRepository } from '../../../repositories/rol-read.repository';

@QueryHandler(GetRolByIdQuery)
export class GetRolByIdHandler implements IQueryHandler<GetRolByIdQuery> {
  constructor(private readonly repository: RolReadRepository) {}

  async execute(query: GetRolByIdQuery) {
    return await this.repository.getById(query.id);
  }
}
