import { AuditLogRepository } from '../../domain/repositories/audit-log.repository';
import { ImplAuditLogRepository } from '../implementation/impl-audit-log.repository';

export const repositories = [
  { provide: AuditLogRepository, useClass: ImplAuditLogRepository },
];
