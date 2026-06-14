import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Pagination } from '@/shared/domain/value-object/pagination';
import { UserReadRepository } from '../../../repositories/user-read.repository';
import { GetUsersQuery } from './get-users.query';
import { UserDto } from '../../../dtos/user.dto';
import { PaginationParams } from '@/shared/domain/value-object/pagination-params';

@QueryHandler(GetUsersQuery)
export class GetUsersHandler implements IQueryHandler<GetUsersQuery> {
  constructor(private readonly userRepository: UserReadRepository) {}

  async execute(
    query: GetUsersQuery,
  ): Promise<Pagination<UserDto> | UserDto[]> {
    if (query.pagination_params) {
      const paginationParams = PaginationParams.create({
        ...query.pagination_params,
      });
      return await this.userRepository.getAllUsers(
        paginationParams,
        query.filter,
      );
    }
    return await this.userRepository.getAllUsers(undefined, query.filter);
  }
}
