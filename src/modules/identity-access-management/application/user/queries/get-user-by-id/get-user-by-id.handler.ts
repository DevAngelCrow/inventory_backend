import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUserByIdQuery } from './get-user-by-id.query';
import { UserReadRepository } from '../../../repositories/user-read.repository';

@QueryHandler(GetUserByIdQuery)
export class GetUserByIdHandler implements IQueryHandler<GetUserByIdQuery> {
  constructor(private readonly repository: UserReadRepository) {}
  async execute(query: GetUserByIdQuery) {
    return await this.repository.getOneById(query.id);
  }
}
