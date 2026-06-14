import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { PaginationParamsDto } from '@/shared/application/dtos/pagination.dto';

export class GetProductsQueryDto extends PaginationParamsDto {
  @IsString()
  @IsOptional()
  filter_name?: string;

  @IsString()
  @IsOptional()
  filter_sku?: string;

  @IsString()
  @IsOptional()
  filter_category?: string;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  status?: boolean;
}
