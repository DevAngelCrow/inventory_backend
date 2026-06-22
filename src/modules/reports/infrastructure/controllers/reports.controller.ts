import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Permissions } from '@/modules/security/infrastructure/decorators/permissions.decorator';
import { SuccessResponseDto } from '@/shared/infrastructure/http/dtos/http-success-response.dto';

import { GetRevenueReportQueryDto } from '../dtos/query/get-revenue-report-query.dto';
import { RevenueReportHttpDto } from '../dtos/http/revenue-report-http.dto';
import { GetRevenueReportQuery } from '../../application/queries/get-revenue-report.query';
import { RevenueReportResult } from '../../application/queries/get-revenue-report.handler';
import { GetDashboardSummaryQuery } from '../../application/queries/get-dashboard-summary.query';
import { DashboardSummaryHttpDto } from '../dtos/http/dashboard-summary-http.dto';
import { DashboardSummaryDto } from '../../application/dtos/dashboard-summary.dto';
@ApiTags('Reports')
@Controller('reports')
@ApiBearerAuth('JWT-auth')
export class ReportsController {
  constructor(private readonly queryBus: QueryBus) {}

  @Permissions('ver-reportes')
  @Get('revenue')
  @HttpCode(HttpStatus.OK)
  async getRevenueReport(
    @Query() query: GetRevenueReportQueryDto,
  ): Promise<SuccessResponseDto<RevenueReportHttpDto>> {
    const appQuery = new GetRevenueReportQuery(
      new Date(query.start_date),
      new Date(query.end_date),
    );
    const result: RevenueReportResult = await this.queryBus.execute(appQuery);
    
    return new SuccessResponseDto(
      RevenueReportHttpDto.fromResult(result),
      HttpStatus.OK,
      'Revenue report generated successfully',
    );
  }

  @Permissions('ver-tablero')
  @Get('dashboard-summary')
  @HttpCode(HttpStatus.OK)
  async getDashboardSummary(): Promise<SuccessResponseDto<DashboardSummaryHttpDto>> {
    const appQuery = new GetDashboardSummaryQuery();
    const result: DashboardSummaryDto = await this.queryBus.execute(appQuery);
    
    return new SuccessResponseDto(
      DashboardSummaryHttpDto.fromDto(result),
      HttpStatus.OK,
      'Dashboard summary generated successfully',
    );
  }
}
