import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { Transform } from 'class-transformer';

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

export class CursorPaginationParamsDto {
  @IsOptional()
  @IsString()
  cursor?: string;

  @IsOptional()
  @Transform(({ value }) =>
    value === undefined || value === '' || value === null
      ? DEFAULT_LIMIT
      : Number(value),
  )
  @IsInt()
  @Min(1)
  @Max(MAX_LIMIT)
  limit: number = DEFAULT_LIMIT;
}
