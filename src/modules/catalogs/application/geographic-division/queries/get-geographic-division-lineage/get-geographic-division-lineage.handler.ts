import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GeographicDivisionQueriesRepository } from '../../../repositories/geographic-division-read.repository';
import { GetGeographicDivisionLineageQuery } from './get-geographic-division-lineage.query';

@QueryHandler(GetGeographicDivisionLineageQuery)
export class GetGeographicDivisionLineageHandler implements IQueryHandler<GetGeographicDivisionLineageQuery> {
  constructor(
    private readonly repository: GeographicDivisionQueriesRepository,
  ) {}

  async execute(query: GetGeographicDivisionLineageQuery): Promise<string[]> {
    return this.repository.getLineage(query.id);
  }
}
