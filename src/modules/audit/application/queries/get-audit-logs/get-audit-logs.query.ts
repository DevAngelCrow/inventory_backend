import { PaginationParamsDto } from '@/shared/application/dtos/pagination.dto';
import { AuditAction } from '../../../domain/enums/audit-action.enum';

export class GetAuditLogsQuery {
  constructor(
    public readonly pagination_params: PaginationParamsDto,
    public readonly action?: AuditAction,
    public readonly user_id?: string,
    public readonly entity_type?: string,
    public readonly from?: string,
    public readonly to?: string,
  ) {}
}
