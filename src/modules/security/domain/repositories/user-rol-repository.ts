import { PaginationParams } from '@/shared/domain/value-object/pagination-params';
import { UserRoleAggregate } from '../aggregates/user-role.aggregate';
import { UserRoleIdUser } from '../value-objects/user-role-value-object/user-role-id-user';
import { Pagination } from '@/shared/domain/value-object/pagination';

export abstract class UserRoleRepository {
  abstract create(user_role: UserRoleAggregate): Promise<void>;
  abstract updateOrCreate(user_role: UserRoleAggregate): Promise<void>;
  abstract getAllByUserId(
    user_id: UserRoleIdUser,
  ): Promise<UserRoleAggregate[]>;
  abstract getAll(
    pagination_params?: PaginationParams,
  ): Promise<Pagination<UserRoleAggregate> | UserRoleAggregate[]>;
}
