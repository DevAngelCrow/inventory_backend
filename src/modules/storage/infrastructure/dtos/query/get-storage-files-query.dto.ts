import { IntersectionType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PaginationParamsDto } from '@/shared/application/dtos/pagination.dto';

export class GetStorageFilesQueryDto extends IntersectionType(
  PaginationParamsDto,
) {
  @IsOptional()
  @IsString()
  id_provider?: string;
}
