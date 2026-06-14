import { Pagination } from '@/shared/domain/value-object/pagination';
import { PaginationParams } from '@/shared/domain/value-object/pagination-params';
import { UserDto } from '../dtos/user.dto';
import { UserAuthDto } from '../dtos/user-auth.dto';

export abstract class UserReadRepository {
  abstract getAllUsers(
    paginationParams?: PaginationParams,
    filter?: { name?: string; email?: string; status?: string },
  ): Promise<Pagination<UserDto> | UserDto[]>;
  public abstract getOneByUserName(
    user_name: string,
  ): Promise<{ user: UserDto; permissions: string[] } | null>;
  public abstract getOneById(id: string): Promise<UserDto | null>;
  public abstract getOneByIdForAuth(id: string): Promise<UserAuthDto | null>;
  public abstract getOneByUserNameForAuth(
    user_name: string,
  ): Promise<UserAuthDto | null>;
  public abstract getOneUserByEmail(email: string): Promise<UserDto | null>;
}
