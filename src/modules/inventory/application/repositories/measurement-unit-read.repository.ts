import { PaginationParamsDto } from '@/shared/application/dtos/pagination.dto';
import { MeasurementUnitDto } from '../dtos/measurement-unit.dto';

export abstract class MeasurementUnitQueriesRepository {
  abstract findAll(
    paginationDto: PaginationParamsDto,
  ): Promise<[MeasurementUnitDto[], number]>;

  abstract findAllActive(): Promise<MeasurementUnitDto[]>;

  abstract findById(id: string): Promise<MeasurementUnitDto | null>;
}
