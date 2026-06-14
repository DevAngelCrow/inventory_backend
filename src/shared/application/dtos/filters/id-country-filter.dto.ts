import { IsOptional, IsUUID } from 'class-validator';

export class IdCountryFilterDto {
  @IsOptional()
  @IsUUID()
  id_country?: string;
}
