import { IsBoolean, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class ActiveFilterDto {
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true' || value === true) return true;
    if (value === 'false' || value === false) return false;
    return undefined;
  })
  @IsBoolean()
  active?: boolean;
}
