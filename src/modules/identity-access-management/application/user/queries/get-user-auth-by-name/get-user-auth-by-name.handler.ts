import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { UserReadRepository } from '../../../repositories/user-read.repository';
import { GetUserAuthByNameQuery } from './get-user-auth-by-name.query';
import { UserAuthDto } from '../../../dtos/user-auth.dto';

@QueryHandler(GetUserAuthByNameQuery)
export class GetUserAuthByNameHandler implements IQueryHandler<GetUserAuthByNameQuery> {
  constructor(private readonly repository: UserReadRepository) {}

  async execute(query: GetUserAuthByNameQuery): Promise<UserAuthDto | null> {
    return await this.repository.getOneByUserNameForAuth(query.user_name);
  }
}
