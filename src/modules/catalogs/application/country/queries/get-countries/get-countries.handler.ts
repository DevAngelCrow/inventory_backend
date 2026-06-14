import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Pagination } from '@/shared/domain/value-object/pagination';
import { GetCountriesQuery } from './get-countries.query';
import { PaginationParams } from '@/shared/domain/value-object/pagination-params';
import { CountryQueriesRepository } from '../../../repositories/country-read.repository';
import { CountryDto } from '../../../dtos/country.dto';
import { CatalogCacheService } from '@/shared/infrastructure/cache/catalog-cache.service';

// Catalog data (countries) changes rarely — 1h TTL is a good default. Any
// create/update/delete command on countries MUST call cache.invalidate() with
// the same key to keep the cached entry honest.
const COUNTRIES_ALL_CACHE_KEY = 'catalogs:countries:all';
const COUNTRIES_ALL_TTL_SECONDS = 3600;

@QueryHandler(GetCountriesQuery)
export class GetCountriesHandler implements IQueryHandler<GetCountriesQuery> {
  constructor(
    private readonly repository: CountryQueriesRepository,
    private readonly cache: CatalogCacheService,
  ) {}
  async execute(
    query: GetCountriesQuery,
  ): Promise<Pagination<CountryDto> | CountryDto[]> {
    if (query.pagination_params) {
      // Pagination + filter requests bypass the cache. Caching every
      // (page, per_page, filter) combo would inflate keys with low hit rate.
      const paginationParams = PaginationParams.create({
        ...query.pagination_params,
      });
      return await this.repository.getAll(
        paginationParams,
        query.filter,
        query.active,
      );
    }
    if (query.filter || query.active !== undefined) {
      return await this.repository.getAll(
        undefined,
        query.filter,
        query.active,
      );
    }
    // Hot path: GET /countries with no params. Cache the full list.
    return this.cache.fetch<CountryDto[]>(
      COUNTRIES_ALL_CACHE_KEY,
      COUNTRIES_ALL_TTL_SECONDS,
      async () => {
        const result = await this.repository.getAll(
          undefined,
          undefined,
          undefined,
        );
        return Array.isArray(result) ? result : result.getEntityList();
      },
    );
  }
}

export const COUNTRIES_CACHE_KEYS = {
  ALL: COUNTRIES_ALL_CACHE_KEY,
} as const;
