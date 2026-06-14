import { IntersectionType } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';
import { PaginationParamsDto } from '@/shared/application/dtos/pagination.dto';
import { CursorPaginationParamsDto } from '@/shared/application/dtos/cursor-pagination.dto';
import {
  ActiveFilterDto,
  FilterStringDto,
  IdCountryFilterDto,
  IdParentFilterDto,
} from '@/shared/application/dtos/filters';

export class GetGeographicDivisionsQueryDto extends IntersectionType(
  PaginationParamsDto,
  FilterStringDto,
  ActiveFilterDto,
  IdCountryFilterDto,
  IdParentFilterDto,
) {
  @IsOptional()
  @IsUUID()
  id_type?: string;
}

export class GetGeographicDivisionsCursorQueryDto extends IntersectionType(
  CursorPaginationParamsDto,
  FilterStringDto,
  ActiveFilterDto,
  IdCountryFilterDto,
  IdParentFilterDto,
) {
  @IsOptional()
  @IsUUID()
  id_type?: string;
}
