import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { PaginationParamsDto } from '@/shared/application/dtos/pagination.dto';

export class GetCustomersQueryDto extends PaginationParamsDto {
  @IsString()
  @IsOptional()
  filter_name?: string;

  @IsString()
  @IsOptional()
  filter_email?: string;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  status?: boolean;
}
