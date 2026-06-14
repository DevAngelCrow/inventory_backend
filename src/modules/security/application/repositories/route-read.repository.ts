import { Pagination } from '@/shared/domain/value-object/pagination';
import { PaginationParams } from '@/shared/domain/value-object/pagination-params';
import { RouteDto } from '../dtos/route.dto';

export abstract class RouteReadRepository {
  abstract getAll(
    pagination_params?: PaginationParams,
    filter?: string,
    active?: boolean,
    id_parent?: string,
  ): Promise<Pagination<RouteDto> | RouteDto[]>;
  abstract getById(id: string): Promise<RouteDto | null>;
}
