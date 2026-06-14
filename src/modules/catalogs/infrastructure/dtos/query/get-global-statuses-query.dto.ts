import { IntersectionType } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';
import { PaginationParamsDto } from '@/shared/application/dtos/pagination.dto';
import {
  FilterNameDto,
  StatusBooleanFilterDto,
} from '@/shared/application/dtos/filters';

export class GetGlobalStatusesQueryDto extends IntersectionType(
  PaginationParamsDto,
  FilterNameDto,
  StatusBooleanFilterDto,
) {
  @IsOptional()
  @IsUUID()
  id_category?: string;

  @IsOptional()
  @IsString()
  code_category?: string;
}
