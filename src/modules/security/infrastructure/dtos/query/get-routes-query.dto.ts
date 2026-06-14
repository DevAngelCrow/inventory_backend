import { IntersectionType } from '@nestjs/swagger';
import { PaginationParamsDto } from '@/shared/application/dtos/pagination.dto';
import {
  ActiveFilterDto,
  IdParentFilterDto,
  NameFilterDto,
} from '@/shared/application/dtos/filters';

export class GetRoutesQueryDto extends IntersectionType(
  PaginationParamsDto,
  NameFilterDto,
  ActiveFilterDto,
  IdParentFilterDto,
) {}
