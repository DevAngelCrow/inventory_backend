import { IntersectionType } from '@nestjs/swagger';
import { PaginationParamsDto } from '@/shared/application/dtos/pagination.dto';
import { FilterStringDto } from '@/shared/application/dtos/filters';

export class GetDocumentsQueryDto extends IntersectionType(
  PaginationParamsDto,
  FilterStringDto,
) {}
