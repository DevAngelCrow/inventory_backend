import { Test, TestingModule } from '@nestjs/testing';
import { GetInvoicesHandler } from './get-invoices.handler';
import { InvoiceQueriesRepository } from '@/modules/billing/application/repositories/invoice-read.repository';
import { GetInvoicesQuery } from './get-invoices.query';

describe('GetInvoicesHandler', () => {
  let handler: GetInvoicesHandler;
  let repository: jest.Mocked<InvoiceQueriesRepository>;

  beforeEach(async () => {
    const mockRepository = {
      getAll: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetInvoicesHandler,
        {
          provide: InvoiceQueriesRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    handler = module.get<GetInvoicesHandler>(GetInvoicesHandler);
    repository = module.get(InvoiceQueriesRepository);
  });

  it('should be defined', () => {
    expect(handler).toBeDefined();
  });

  it('should call repository.getAll with correct parameters', async () => {
    repository.getAll.mockResolvedValue([]);

    const query = new GetInvoicesQuery(
      { page: 1, per_page: 10 },
      'res-123',
      'cust-123',
      'ISSUED',
    );

    await handler.execute(query);

    expect(repository.getAll).toHaveBeenCalledTimes(1);
    expect(repository.getAll).toHaveBeenCalledWith(
      expect.anything(), // paginationParams
      'res-123',
      'cust-123',
      'ISSUED',
    );
  });

  it('should call repository.getAll without pagination params', async () => {
    repository.getAll.mockResolvedValue([]);

    const query = new GetInvoicesQuery(undefined, undefined, undefined, undefined);

    await handler.execute(query);

    expect(repository.getAll).toHaveBeenCalledTimes(1);
    expect(repository.getAll).toHaveBeenCalledWith(
      undefined,
      undefined,
      undefined,
      undefined,
    );
  });
});
