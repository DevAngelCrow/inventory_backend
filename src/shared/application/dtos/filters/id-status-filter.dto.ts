import { IsOptional, IsUUID } from 'class-validator';

export class IdStatusFilterDto {
  @IsOptional()
  @IsUUID()
  id_status?: string;
}
