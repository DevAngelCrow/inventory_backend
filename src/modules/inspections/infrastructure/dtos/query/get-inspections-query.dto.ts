import { IsOptional, IsString } from 'class-validator';
import { PaginationParamsDto } from '@/shared/application/dtos/pagination.dto';

export class GetInspectionsQueryDto extends PaginationParamsDto {
  @IsString()
  @IsOptional()
  filter_reservation?: string;

  @IsString()
  @IsOptional()
  filter_status?: string;
}
