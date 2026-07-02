import { Test, TestingModule } from '@nestjs/testing';
import { GetRevenueReportHandler } from './get-revenue-report.handler';
import { PrismaService } from '@/shared/infrastructure/persistence/prisma/prisma.service';
import { GetRevenueReportQuery } from './get-revenue-report.query';

describe('GetRevenueReportHandler', () => {
  let handler: GetRevenueReportHandler;
  let prismaService: jest.Mocked<PrismaService>;

  beforeEach(async () => {
    const mockPrismaService = {
      client: {
        mnt_invoice: {
          findMany: jest.fn(),
        },
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetRevenueReportHandler,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    handler = module.get<GetRevenueReportHandler>(GetRevenueReportHandler);
    prismaService = module.get(PrismaService);
  });

  it('should be defined', () => {
    expect(handler).toBeDefined();
  });

  it('should calculate revenue correctly', async () => {
    const startDate = new Date('2023-01-01');
    const endDate = new Date('2023-12-31');

    (prismaService.client.mnt_invoice.findMany as jest.Mock).mockResolvedValue([
      { total: 100 },
      { total: 200 },
      { total: 300 },
    ]);

    const query = new GetRevenueReportQuery(startDate, endDate);
    const result = await handler.execute(query);

    expect(prismaService.client.mnt_invoice.findMany).toHaveBeenCalledTimes(1);
    expect(prismaService.client.mnt_invoice.findMany).toHaveBeenCalledWith({
      where: {
        issue_date: {
          gte: startDate,
          lte: endDate,
        },
        status: {
          not: 'CANCELLED',
        },
      },
      select: {
        total: true,
      },
    });

    expect(result.totalInvoices).toBe(3);
    expect(result.totalRevenue).toBe(600);
    expect(result.startDate).toBe(startDate);
    expect(result.endDate).toBe(endDate);
  });
});
