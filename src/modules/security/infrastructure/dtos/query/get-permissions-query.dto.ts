import { IntersectionType } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';
import { PaginationParamsDto } from '@/shared/application/dtos/pagination.dto';
import {
  ActiveFilterDto,
  NameFilterDto,
} from '@/shared/application/dtos/filters';

export class GetPermissionsQueryDto extends IntersectionType(
  PaginationParamsDto,
  NameFilterDto,
  ActiveFilterDto,
) {
  @IsOptional()
  @IsUUID()
  category_permission_id?: string;
}
