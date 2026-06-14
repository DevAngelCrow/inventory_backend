import { AuditAction } from '../../domain/enums/audit-action.enum';
import { AuditLogDto } from '../../application/dtos/audit-log.dto';

export class AuditLogHttpDto {
  constructor(
    public readonly id: string,
    public readonly action: AuditAction,
    public readonly user_name: string | null,
    public readonly user_id: string | null,
    public readonly ip_address: string | null,
    public readonly user_agent: string | null,
    public readonly entity_type: string | null,
    public readonly entity_id: string | null,
    public readonly metadata: Record<string, unknown> | null,
    public readonly created_at: Date,
  ) {}

  public static fromDto(dto: AuditLogDto): AuditLogHttpDto {
    return new AuditLogHttpDto(
      dto.id,
      dto.action,
      dto.user_name,
      dto.user_id,
      dto.ip_address,
      dto.user_agent,
      dto.entity_type,
      dto.entity_id,
      dto.metadata,
      dto.created_at,
    );
  }
}
