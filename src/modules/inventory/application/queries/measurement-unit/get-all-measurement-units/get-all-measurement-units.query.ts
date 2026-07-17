import { PaginationParamsDto } from '@/shared/application/dtos/pagination.dto';

export class GetAllMeasurementUnitsQuery {
  constructor(public readonly paginationDto: PaginationParamsDto) {}
}
