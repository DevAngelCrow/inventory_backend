import { IntersectionType } from '@nestjs/swagger';
import { PaginationParamsDto } from '@/shared/application/dtos/pagination.dto';
import {
  ActiveFilterDto,
  NameFilterDto,
} from '@/shared/application/dtos/filters';

export class GetCategoryPermissionsQueryDto extends IntersectionType(
  PaginationParamsDto,
  NameFilterDto,
  ActiveFilterDto,
) {}
