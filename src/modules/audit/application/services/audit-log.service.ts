import { Injectable, Logger } from '@nestjs/common';
import { AuditLogRepository } from '../../domain/repositories/audit-log.repository';
import { AuditLog } from '../../domain/entities/audit-log';
import { AuditAction } from '../../domain/enums/audit-action.enum';

export interface AuditLogEntry {
  action: AuditAction;
  user_name?: string | null;
  user_id?: string | null;
  ip_address?: string | null;
  user_agent?: string | null;
  metadata?: Record<string, unknown> | null;
  /** The type/name of the business entity affected (e.g. 'User', 'Invoice') */
  entity_type?: string | null;
  /** The ID of the business entity affected */
  entity_id?: string | null;
}

@Injectable()
export class AuditLogService {
  private readonly logger = new Logger(AuditLogService.name);

  constructor(private readonly auditLogRepository: AuditLogRepository) {}

  /**
   * Fire-and-forget: writes the audit entry without blocking the response.
   * Any persistence failure is swallowed and logged as a warning so that
   * audit errors never affect the main business flow.
   */
  log(entry: AuditLogEntry): void {
    const auditLog = AuditLog.create(entry);
    this.auditLogRepository.create(auditLog).catch((err: Error) => {
      this.logger.warn(
        `Failed to write audit log [${entry.action}]: ${err.message}`,
      );
    });
  }
}
