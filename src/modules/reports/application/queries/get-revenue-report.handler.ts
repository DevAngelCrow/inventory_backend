import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetRevenueReportQuery } from './get-revenue-report.query';
import { Inject } from '@nestjs/common';
import { IReportsReadRepository, REPORTS_READ_REPOSITORY } from '../repositories/reports-read.repository';

export interface RevenueReportResult {
  totalRevenue: number;
  totalInvoices: number;
  startDate: Date;
  endDate: Date;
}

@QueryHandler(GetRevenueReportQuery)
export class GetRevenueReportHandler implements IQueryHandler<GetRevenueReportQuery> {
  constructor(
    @Inject(REPORTS_READ_REPOSITORY)
    private readonly reportsReadRepository: IReportsReadRepository,
  ) {}

  async execute(query: GetRevenueReportQuery): Promise<RevenueReportResult> {
    const { totalRevenue, totalInvoices } = await this.reportsReadRepository.getRevenueSummary(
      query.start_date,
      query.end_date,
    );

    return {
      totalRevenue,
      totalInvoices,
      startDate: query.start_date,
      endDate: query.end_date,
    };
  }
}
