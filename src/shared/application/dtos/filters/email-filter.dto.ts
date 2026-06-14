import { IsOptional, IsString } from 'class-validator';

export class EmailFilterDto {
  @IsOptional()
  @IsString()
  email?: string;
}
