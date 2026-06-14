import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { NotFoundException } from '@/shared/domain/exceptions/not-found.exception';
import { GeographicDivisionQueriesRepository } from '../../../repositories/geographic-division-read.repository';
import { GeographicDivisionDto } from '../../../dtos/geographic-division.dto';
import { GetGeographicDivisionQuery } from './get-geographic-division.query';

@QueryHandler(GetGeographicDivisionQuery)
export class GetGeographicDivisionHandler implements IQueryHandler<GetGeographicDivisionQuery> {
  constructor(
    private readonly repository: GeographicDivisionQueriesRepository,
  ) {}

  async execute(
    query: GetGeographicDivisionQuery,
  ): Promise<GeographicDivisionDto> {
    const entity = await this.repository.getOneById(query.id);
    if (!entity) throw new NotFoundException('GeographicDivision', query.id);
    return entity;
  }
}
