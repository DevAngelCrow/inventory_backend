import { Pagination } from '@/shared/domain/value-object/pagination';
import { PaginationParams } from '@/shared/domain/value-object/pagination-params';
import { CategoryPermissionsDto } from '../dtos/category-permissions.dto';

export abstract class CategoryPermissionsReadRepository {
  abstract getAll(
    pagination_params?: PaginationParams,
    filter?: string,
    active?: boolean,
  ): Promise<Pagination<CategoryPermissionsDto> | CategoryPermissionsDto[]>;
  abstract getOneById(id: string): Promise<CategoryPermissionsDto | null>;
}
