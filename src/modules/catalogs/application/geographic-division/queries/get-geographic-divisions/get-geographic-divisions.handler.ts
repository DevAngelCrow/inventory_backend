import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Pagination } from '@/shared/domain/value-object/pagination';
import { PaginationParams } from '@/shared/domain/value-object/pagination-params';
import { GeographicDivisionQueriesRepository } from '../../../repositories/geographic-division-read.repository';
import { GeographicDivisionDto } from '../../../dtos/geographic-division.dto';
import { GetGeographicDivisionsQuery } from './get-geographic-divisions.query';

@QueryHandler(GetGeographicDivisionsQuery)
export class GetGeographicDivisionsHandler implements IQueryHandler<GetGeographicDivisionsQuery> {
  constructor(
    private readonly repository: GeographicDivisionQueriesRepository,
  ) {}

  async execute(
    query: GetGeographicDivisionsQuery,
  ): Promise<Pagination<GeographicDivisionDto> | GeographicDivisionDto[]> {
    if (query.pagination_params) {
      const paginationParams = PaginationParams.create({
        ...query.pagination_params,
      });
      return this.repository.getAll(
        paginationParams,
        query.filter,
        query.active,
        query.id_country,
        query.id_parent,
        query.id_type,
      );
    }
    return this.repository.getAll(
      undefined,
      query.filter,
      query.active,
      query.id_country,
      query.id_parent,
      query.id_type,
    );
  }
}
