import { AuditAction } from '../enums/audit-action.enum';

export class AuditLog {
  constructor(
    public readonly action: AuditAction,
    public readonly user_name: string | null,
    public readonly user_id: string | null,
    public readonly ip_address: string | null,
    public readonly user_agent: string | null,
    public readonly metadata: Record<string, unknown> | null,
    public readonly entity_type: string | null,
    public readonly entity_id: string | null,
    public readonly id?: string,
    public readonly created_at?: Date,
  ) {}

  static create(data: {
    action: AuditAction;
    user_name?: string | null;
    user_id?: string | null;
    ip_address?: string | null;
    user_agent?: string | null;
    metadata?: Record<string, unknown> | null;
    entity_type?: string | null;
    entity_id?: string | null;
  }): AuditLog {
    return new AuditLog(
      data.action,
      data.user_name ?? null,
      data.user_id ?? null,
      data.ip_address ?? null,
      // Truncate user-agent to 512 chars to prevent oversized payloads
      data.user_agent ? data.user_agent.slice(0, 512) : null,
      data.metadata ?? null,
      data.entity_type ?? null,
      data.entity_id ?? null,
    );
  }
}
