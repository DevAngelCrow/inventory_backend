import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAuditLogsQuery } from './get-audit-logs.query';
import { PaginationParams } from '@/shared/domain/value-object/pagination-params';
import { AuditLogRepository } from '../../../domain/repositories/audit-log.repository';
import { Pagination } from '@/shared/domain/value-object/pagination';
import { AuditLogDto } from '../../dtos/audit-log.dto';

@QueryHandler(GetAuditLogsQuery)
export class GetAuditLogsHandler implements IQueryHandler<GetAuditLogsQuery> {
  constructor(private readonly repository: AuditLogRepository) {}

  async execute(query: GetAuditLogsQuery): Promise<Pagination<AuditLogDto>> {
    const paginationParams = PaginationParams.create({
      page: query.pagination_params.page,
      per_page: query.pagination_params.per_page,
    });

    return this.repository.getAll(paginationParams, {
      action: query.action,
      user_id: query.user_id,
      entity_type: query.entity_type,
      from: query.from ? new Date(query.from) : undefined,
      to: query.to ? new Date(query.to) : undefined,
    });
  }
}
