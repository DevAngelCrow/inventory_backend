import { IsOptional, IsString } from 'class-validator';
import { PaginationParamsDto } from '@/shared/application/dtos/pagination.dto';

export class GetPaymentsQueryDto extends PaginationParamsDto {
  @IsString()
  @IsOptional()
  id_reservation?: string;

  @IsString()
  @IsOptional()
  filter_reservation?: string;

  @IsString()
  @IsOptional()
  filter_status?: string;
}
