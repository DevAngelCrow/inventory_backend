import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUserByUserNameQuery } from './get-user-by-user-name.query';
import { UserReadRepository } from '../../../repositories/user-read.repository';

import { UserDto } from '../../../dtos/user.dto';

@QueryHandler(GetUserByUserNameQuery)
export class GetUserByUserNameHandler implements IQueryHandler<GetUserByUserNameQuery> {
  constructor(private readonly repository: UserReadRepository) {}

  async execute(
    query: GetUserByUserNameQuery,
  ): Promise<{ user: UserDto; permissions: string[] } | null> {
    return await this.repository.getOneByUserName(query.user_name);
  }
}
