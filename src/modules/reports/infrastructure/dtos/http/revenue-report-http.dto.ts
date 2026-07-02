import { RevenueReportResult } from '../../../application/queries/get-revenue-report.handler';

export class RevenueReportHttpDto {
  constructor(
    public readonly total_revenue: number,
    public readonly total_invoices: number,
    public readonly start_date: Date,
    public readonly end_date: Date,
  ) {}

  public static fromResult(result: RevenueReportResult): RevenueReportHttpDto {
    return new RevenueReportHttpDto(
      result.totalRevenue,
      result.totalInvoices,
      result.startDate,
      result.endDate,
    );
  }
}
