import { Pagination } from '@/shared/domain/value-object/pagination';
import { GetUsersHandler } from '../user/queries/get-users/get-users.handler';
import { GetUsersQuery } from '../user/queries/get-users/get-users.query';
import { UserDto } from '../dtos/user.dto';

export class GetAllUsersService {
  constructor(private readonly getAllUsers: GetUsersHandler) {}

  async run(query: GetUsersQuery): Promise<Pagination<UserDto> | UserDto[]> {
    return await this.getAllUsers.execute(query);
  }
}
