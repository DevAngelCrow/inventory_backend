import { IsOptional, IsUUID } from 'class-validator';

export class IdParentFilterDto {
  @IsOptional()
  @IsUUID()
  id_parent?: string;
}
