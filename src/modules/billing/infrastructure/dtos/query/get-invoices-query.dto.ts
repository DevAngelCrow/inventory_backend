import { IsOptional, IsString } from 'class-validator';
import { PaginationParamsDto } from '@/shared/application/dtos/pagination.dto';

export class GetInvoicesQueryDto extends PaginationParamsDto {
  @IsString()
  @IsOptional()
  filter_reservation?: string;

  @IsString()
  @IsOptional()
  filter_customer?: string;

  @IsString()
  @IsOptional()
  filter_status?: string;
}
