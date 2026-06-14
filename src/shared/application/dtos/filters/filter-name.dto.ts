import { IsOptional, IsString } from 'class-validator';

export class FilterNameDto {
  @IsOptional()
  @IsString()
  filter_name?: string;
}
