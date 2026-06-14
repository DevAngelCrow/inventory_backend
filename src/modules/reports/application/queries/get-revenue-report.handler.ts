import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetRevenueReportQuery } from './get-revenue-report.query';
import { PrismaService } from '@/shared/infrastructure/persistence/prisma/prisma.service';

export interface RevenueReportResult {
  totalRevenue: number;
  totalInvoices: number;
  startDate: Date;
  endDate: Date;
}

@QueryHandler(GetRevenueReportQuery)
export class GetRevenueReportHandler implements IQueryHandler<GetRevenueReportQuery> {
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: GetRevenueReportQuery): Promise<RevenueReportResult> {
    const invoices = await this.prisma.client.mnt_invoice.findMany({
      where: {
        issue_date: {
          gte: query.start_date,
          lte: query.end_date,
        },
        status: {
          not: 'CANCELLED',
        },
      },
      select: {
        total: true,
      },
    });

    const totalRevenue = invoices.reduce((acc, inv) => acc + Number(inv.total), 0);

    return {
      totalRevenue,
      totalInvoices: invoices.length,
      startDate: query.start_date,
      endDate: query.end_date,
    };
  }
}
