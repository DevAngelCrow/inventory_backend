import { Pagination } from '@/shared/domain/value-object/pagination';
import { GeographicDivisionDto } from '../../dtos/geographic-division.dto';
import { GetGeographicDivisionsHandler } from '../../geographic-division/queries/get-geographic-divisions/get-geographic-divisions.handler';
import { GetGeographicDivisionsQuery } from '../../geographic-division/queries/get-geographic-divisions/get-geographic-divisions.query';

export class GetGeographicDivisionsService {
  constructor(
    private readonly getGeographicDivisionsHandler: GetGeographicDivisionsHandler,
  ) {}

  async run(
    query: GetGeographicDivisionsQuery,
  ): Promise<Pagination<GeographicDivisionDto> | GeographicDivisionDto[]> {
    return await this.getGeographicDivisionsHandler.execute(query);
  }
}
