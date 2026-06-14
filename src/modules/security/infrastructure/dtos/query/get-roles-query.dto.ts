import { IntersectionType } from '@nestjs/swagger';
import { PaginationParamsDto } from '@/shared/application/dtos/pagination.dto';
import {
  IdStatusFilterDto,
  NameFilterDto,
} from '@/shared/application/dtos/filters';

export class GetRolesQueryDto extends IntersectionType(
  PaginationParamsDto,
  NameFilterDto,
  IdStatusFilterDto,
) {}
