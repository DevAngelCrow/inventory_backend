import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetActiveMeasurementUnitsQuery } from './get-active-measurement-units.query';
import { MeasurementUnitQueriesRepository } from '../../../../application/repositories/measurement-unit-read.repository';
import { MeasurementUnitDto } from '../../../../application/dtos/measurement-unit.dto';

@QueryHandler(GetActiveMeasurementUnitsQuery)
export class GetActiveMeasurementUnitsHandler
  implements IQueryHandler<GetActiveMeasurementUnitsQuery>
{
  constructor(
    private readonly measurementUnitQueriesRepository: MeasurementUnitQueriesRepository,
  ) {}

  async execute(): Promise<MeasurementUnitDto[]> {
    return this.measurementUnitQueriesRepository.findAllActive();
  }
}
