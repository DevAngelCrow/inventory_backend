import { Pagination } from '@/shared/domain/value-object/pagination';
import { PaginationParams } from '@/shared/domain/value-object/pagination-params';
import { GeographicDivisionTypeDto } from '../dtos/geographic-division-type.dto';

export abstract class GeographicDivisionTypeQueriesRepository {
  abstract getAll(
    pagination_params?: PaginationParams,
    filter?: string,
    active?: boolean,
    id_country?: string,
  ): Promise<
    Pagination<GeographicDivisionTypeDto> | GeographicDivisionTypeDto[]
  >;
  abstract getOneById(id: string): Promise<GeographicDivisionTypeDto | null>;
}
