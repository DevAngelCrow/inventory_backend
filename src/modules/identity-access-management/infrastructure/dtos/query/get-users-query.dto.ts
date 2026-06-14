import { IntersectionType } from '@nestjs/swagger';
import { PaginationParamsDto } from '@/shared/application/dtos/pagination.dto';
import {
  EmailFilterDto,
  IdStatusFilterDto,
  NameFilterDto,
} from '@/shared/application/dtos/filters';

export class GetUsersQueryDto extends IntersectionType(
  PaginationParamsDto,
  NameFilterDto,
  EmailFilterDto,
  IdStatusFilterDto,
) {}
