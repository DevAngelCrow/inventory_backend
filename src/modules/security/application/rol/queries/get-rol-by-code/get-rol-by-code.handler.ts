import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { RolReadRepository } from '../../../repositories/rol-read.repository';
import { GetRolByCodeQuery } from './get-rol-by-code.query';

@QueryHandler(GetRolByCodeQuery)
export class GetRolByCodeHandler implements IQueryHandler<GetRolByCodeQuery> {
  constructor(private readonly repository: RolReadRepository) {}

  async execute(query: GetRolByCodeQuery) {
    return await this.repository.getByCode(query.code);
  }
}
