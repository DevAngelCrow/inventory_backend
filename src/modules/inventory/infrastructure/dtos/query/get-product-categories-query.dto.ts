import { IsBoolean, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { PaginationParamsDto } from '@/shared/application/dtos/pagination.dto';

export class GetProductCategoriesQueryDto extends PaginationParamsDto {
  @IsString()
  @IsOptional()
  filter_name?: string;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  status?: boolean;
}
