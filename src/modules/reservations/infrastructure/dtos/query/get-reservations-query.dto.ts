import { IsDate, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { PaginationParamsDto } from '@/shared/application/dtos/pagination.dto';

export class GetReservationsQueryDto extends PaginationParamsDto {
  @IsString()
  @IsOptional()
  filter_customer?: string;

  @IsString()
  @IsOptional()
  filter_status?: string;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  filter_date_start?: Date;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  filter_date_end?: Date;
}
