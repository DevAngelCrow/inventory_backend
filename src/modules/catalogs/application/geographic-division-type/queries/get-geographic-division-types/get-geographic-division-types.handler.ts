import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Pagination } from '@/shared/domain/value-object/pagination';
import { PaginationParams } from '@/shared/domain/value-object/pagination-params';
import { GeographicDivisionTypeQueriesRepository } from '../../../repositories/geographic-division-type-read.repository';
import { GeographicDivisionTypeDto } from '../../../dtos/geographic-division-type.dto';
import { GetGeographicDivisionTypesQuery } from './get-geographic-division-types.query';

@QueryHandler(GetGeographicDivisionTypesQuery)
export class GetGeographicDivisionTypesHandler implements IQueryHandler<GetGeographicDivisionTypesQuery> {
  constructor(
    private readonly repository: GeographicDivisionTypeQueriesRepository,
  ) {}

  async execute(
    query: GetGeographicDivisionTypesQuery,
  ): Promise<
    Pagination<GeographicDivisionTypeDto> | GeographicDivisionTypeDto[]
  > {
    if (query.pagination_params) {
      const paginationParams = PaginationParams.create({
        ...query.pagination_params,
      });
      return this.repository.getAll(
        paginationParams,
        query.filter,
        query.active,
        query.id_country,
      );
    }
    return this.repository.getAll(
      undefined,
      query.filter,
      query.active,
      query.id_country,
    );
  }
}
