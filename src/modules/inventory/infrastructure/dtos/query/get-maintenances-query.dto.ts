import { IsBoolean, IsOptional, IsUUID } from 'class-validator';
import { Transform } from 'class-transformer';
import { PaginationParamsDto } from '@/shared/application/dtos/pagination.dto';

export class GetMaintenancesQueryDto extends PaginationParamsDto {
  @IsUUID()
  @IsOptional()
  id_product?: string;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  resolved?: boolean;
}
