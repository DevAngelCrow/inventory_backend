import { Pagination } from '@/shared/domain/value-object/pagination';
import { PaginationParams } from '@/shared/domain/value-object/pagination-params';
import { CountryDto } from '../dtos/country.dto';

export abstract class CountryQueriesRepository {
  abstract getAll(
    pagination_params?: PaginationParams,
    filter?: string,
    active?: boolean,
  ): Promise<Pagination<CountryDto> | CountryDto[]>;
  abstract getOneById(id: string): Promise<CountryDto | null>;
}
