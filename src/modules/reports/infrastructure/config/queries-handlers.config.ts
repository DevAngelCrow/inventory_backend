import { GetRevenueReportHandler } from '../../application/queries/get-revenue-report.handler';
import { GetDashboardSummaryHandler } from '../../application/queries/get-dashboard-summary.handler';

export const reportsQueryHandlerProviders = [
  GetRevenueReportHandler,
  GetDashboardSummaryHandler,
];
