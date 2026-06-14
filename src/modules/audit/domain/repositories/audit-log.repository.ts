import { AuditLog } from '../entities/audit-log';
import { Pagination } from '@/shared/domain/value-object/pagination';
import { PaginationParams } from '@/shared/domain/value-object/pagination-params';
import { AuditLogDto } from '../../application/dtos/audit-log.dto';

export interface AuditLogFilters {
  action?: string;
  user_id?: string;
  entity_type?: string;
  from?: Date;
  to?: Date;
}

export abstract class AuditLogRepository {
  abstract create(auditLog: AuditLog): Promise<void>;
  abstract getAll(
    pagination_params: PaginationParams,
    filters?: AuditLogFilters,
  ): Promise<Pagination<AuditLogDto>>;
}
