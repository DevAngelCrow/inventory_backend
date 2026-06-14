import { Pagination } from '@/shared/domain/value-object/pagination';
import { PaginationParams } from '@/shared/domain/value-object/pagination-params';
import { CategoryStatusDto } from '../dtos/category-status.dto';

export abstract class CategoryStatusQueriesRepository {
  abstract getAll(
    pagination_params?: PaginationParams,
    filter?: string,
    active?: boolean,
  ): Promise<Pagination<CategoryStatusDto> | CategoryStatusDto[]>;
  abstract getOneById(id: string): Promise<CategoryStatusDto | null>;
}
