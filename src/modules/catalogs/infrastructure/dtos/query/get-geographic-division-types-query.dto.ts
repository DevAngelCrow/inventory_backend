import { IntersectionType } from '@nestjs/swagger';
import { PaginationParamsDto } from '@/shared/application/dtos/pagination.dto';
import {
  ActiveFilterDto,
  FilterStringDto,
  IdCountryFilterDto,
} from '@/shared/application/dtos/filters';

export class GetGeographicDivisionTypesQueryDto extends IntersectionType(
  PaginationParamsDto,
  FilterStringDto,
  ActiveFilterDto,
  IdCountryFilterDto,
) {}
