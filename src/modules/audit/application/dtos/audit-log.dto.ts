import { AuditAction } from '../../domain/enums/audit-action.enum';

export class AuditLogDto {
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
}
