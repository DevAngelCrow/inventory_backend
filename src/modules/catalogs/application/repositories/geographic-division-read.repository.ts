import { Pagination } from '@/shared/domain/value-object/pagination';
import { PaginationParams } from '@/shared/domain/value-object/pagination-params';
import { GeographicDivisionDto } from '../dtos/geographic-division.dto';

export abstract class GeographicDivisionQueriesRepository {
  abstract getAll(
    pagination_params?: PaginationParams,
    filter?: string,
    active?: boolean,
    id_country?: string,
    id_parent?: string,
    id_type?: string,
  ): Promise<Pagination<GeographicDivisionDto> | GeographicDivisionDto[]>;
  abstract getOneById(id: string): Promise<GeographicDivisionDto | null>;
  abstract getAllWithCursor(
    cursor: string | undefined,
    limit: number,
    filter?: string,
    active?: boolean,
    id_country?: string,
    id_parent?: string,
    id_type?: string,
  ): Promise<{ data: GeographicDivisionDto[]; next_cursor: string | null }>;
}
