import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GeographicDivisionQueriesRepository } from '../../../repositories/geographic-division-read.repository';
import { GeographicDivisionDto } from '../../../dtos/geographic-division.dto';
import { GetGeographicDivisionsCursorQuery } from './get-geographic-divisions-cursor.query';

@QueryHandler(GetGeographicDivisionsCursorQuery)
export class GetGeographicDivisionsCursorHandler implements IQueryHandler<GetGeographicDivisionsCursorQuery> {
  constructor(
    private readonly repository: GeographicDivisionQueriesRepository,
  ) {}

  async execute(
    query: GetGeographicDivisionsCursorQuery,
  ): Promise<{ data: GeographicDivisionDto[]; next_cursor: string | null }> {
    return this.repository.getAllWithCursor(
      query.cursor,
      query.limit,
      query.filter,
      query.active,
      query.id_country,
      query.id_parent,
      query.id_type,
    );
  }
}
