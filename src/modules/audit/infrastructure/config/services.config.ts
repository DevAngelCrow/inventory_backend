import { registerService } from '@/shared/infrastructure/factories/register-service.factory';
import { AuditLogService } from '../../application/services/audit-log.service';
import { AuditLogRepository } from '../../domain/repositories/audit-log.repository';
import { AuditLoggerPort } from '../../domain/ports/audit-logger.port';

const servicesToRegister = [
  {
    service: AuditLogService,
    deps: [AuditLogRepository, AuditLoggerPort],
  },
];

export const services = servicesToRegister.map((uc) => {
  return registerService(uc.service, uc.deps);
});
