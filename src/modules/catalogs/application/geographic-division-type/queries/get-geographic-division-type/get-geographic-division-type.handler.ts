import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { NotFoundException } from '@/shared/domain/exceptions/not-found.exception';
import { GeographicDivisionTypeQueriesRepository } from '../../../repositories/geographic-division-type-read.repository';
import { GeographicDivisionTypeDto } from '../../../dtos/geographic-division-type.dto';
import { GetGeographicDivisionTypeQuery } from './get-geographic-division-type.query';

@QueryHandler(GetGeographicDivisionTypeQuery)
export class GetGeographicDivisionTypeHandler implements IQueryHandler<GetGeographicDivisionTypeQuery> {
  constructor(
    private readonly repository: GeographicDivisionTypeQueriesRepository,
  ) {}

  async execute(
    query: GetGeographicDivisionTypeQuery,
  ): Promise<GeographicDivisionTypeDto> {
    const entity = await this.repository.getOneById(query.id);
    if (!entity)
      throw new NotFoundException('GeographicDivisionType', query.id);
    return entity;
  }
}
