import { IsOptional, IsString } from 'class-validator';

export class FilterStringDto {
  @IsOptional()
  @IsString()
  filter?: string;
}
