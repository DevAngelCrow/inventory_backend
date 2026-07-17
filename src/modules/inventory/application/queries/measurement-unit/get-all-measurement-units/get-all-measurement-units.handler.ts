import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllMeasurementUnitsQuery } from './get-all-measurement-units.query';
import { MeasurementUnitQueriesRepository } from '../../../../application/repositories/measurement-unit-read.repository';
import { MeasurementUnitDto } from '../../../../application/dtos/measurement-unit.dto';

@QueryHandler(GetAllMeasurementUnitsQuery)
export class GetAllMeasurementUnitsHandler
  implements IQueryHandler<GetAllMeasurementUnitsQuery>
{
  constructor(
    private readonly measurementUnitQueriesRepository: MeasurementUnitQueriesRepository,
  ) {}

  async execute(
    query: GetAllMeasurementUnitsQuery,
  ): Promise<[MeasurementUnitDto[], number]> {
    return this.measurementUnitQueriesRepository.findAll(query.paginationDto);
  }
}
