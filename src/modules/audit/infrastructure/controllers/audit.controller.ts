import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { QueryBus } from '@nestjs/cqrs';
import { Permissions } from '@/modules/security/infrastructure/decorators/permissions.decorator';
import { SuccessResponseDto } from '@/shared/infrastructure/http/dtos/http-success-response.dto';
import { HttpPaginatedResponseDto } from '@/shared/infrastructure/http/dtos/http-paginated-response.dto';
import { Pagination } from '@/shared/domain/value-object/pagination';
import { GetAuditLogsQuery } from '../../application/queries/get-audit-logs/get-audit-logs.query';
import { AuditLogDto } from '../../application/dtos/audit-log.dto';
import { AuditLogHttpDto } from '../dtos/audit-log-http.dto';
import { AuditLogsQueryDto } from '../dtos/audit-logs-query.dto';

@Controller('audit')
@ApiBearerAuth('JWT-auth')
export class AuditController {
  constructor(private readonly queryBus: QueryBus) {}

  @Permissions('listar-audit-logs')
  @Get('logs')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'List audit logs with optional filters and pagination',
  })
  @ApiResponse({ status: 200, description: 'Paginated audit log list' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async getLogs(
    @Query() params: AuditLogsQueryDto,
  ): Promise<SuccessResponseDto<HttpPaginatedResponseDto<AuditLogHttpDto>>> {
    const result: Pagination<AuditLogDto> = await this.queryBus.execute(
      new GetAuditLogsQuery(
        params,
        params.action,
        params.user_id,
        params.entity_type,
        params.from,
        params.to,
      ),
    );

    const items = result
      .getEntityList()
      .map((item) => AuditLogHttpDto.fromDto(item));
    const response = new HttpPaginatedResponseDto<AuditLogHttpDto>(
      items,
      result.getTotalItems(),
      result.getTotalPages(),
      params.page,
      params.per_page,
    );

    return new SuccessResponseDto(
      response,
      HttpStatus.OK,
      'Audit logs retrieved successfully',
    );
  }
}
