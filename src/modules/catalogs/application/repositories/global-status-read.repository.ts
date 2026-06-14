import { Pagination } from '@/shared/domain/value-object/pagination';
import { PaginationParams } from '@/shared/domain/value-object/pagination-params';
import { GlobalStatusDto } from '../dtos/global-status.dto';

export abstract class GlobalStatusQueriesRepository {
  abstract getAll(
    pagination_params?: PaginationParams,
    filter?: string,
    active?: boolean,
    id_category?: string,
    code_category?: string,
  ): Promise<Pagination<GlobalStatusDto> | GlobalStatusDto[]>;
  abstract getOneById(id: string): Promise<GlobalStatusDto | null>;
  abstract getOneByCode(
    code: string,
    category: string,
  ): Promise<GlobalStatusDto | null>;
}
