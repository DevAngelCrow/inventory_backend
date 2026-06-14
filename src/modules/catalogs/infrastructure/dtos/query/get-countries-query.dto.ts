import { IntersectionType } from '@nestjs/swagger';
import { PaginationParamsDto } from '@/shared/application/dtos/pagination.dto';
import {
  FilterNameDto,
  StatusBooleanFilterDto,
} from '@/shared/application/dtos/filters';

export class GetCountriesQueryDto extends IntersectionType(
  PaginationParamsDto,
  FilterNameDto,
  StatusBooleanFilterDto,
) {}
