import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginationParamsDto } from '@/shared/application/dtos/pagination.dto';
import { AuditAction } from '../../domain/enums/audit-action.enum';

export class AuditLogsQueryDto extends PaginationParamsDto {
  @IsOptional()
  @IsEnum(AuditAction)
  action?: AuditAction;

  @IsOptional()
  @IsString()
  user_id?: string;

  @IsOptional()
  @IsString()
  entity_type?: string;

  @IsOptional()
  @IsDateString()
  from?: string;

  @IsOptional()
  @IsDateString()
  to?: string;
}
