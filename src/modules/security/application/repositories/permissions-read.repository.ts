import { Pagination } from '@/shared/domain/value-object/pagination';
import { PaginationParams } from '@/shared/domain/value-object/pagination-params';
import { PermissionsDto } from '../dtos/permissions.dto';

export abstract class PermissionsReadRepository {
  abstract getAll(
    pagination_params?: PaginationParams,
    filter?: string,
    active?: boolean,
    category_permission_id?: string,
  ): Promise<Pagination<PermissionsDto> | PermissionsDto[]>;
  abstract getOneById(id: string): Promise<PermissionsDto | null>;
}
