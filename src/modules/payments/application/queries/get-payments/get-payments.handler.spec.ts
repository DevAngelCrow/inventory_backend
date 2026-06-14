import { Test, TestingModule } from '@nestjs/testing';
import { GetPaymentsHandler } from './get-payments.handler';
import { PaymentQueriesRepository } from '@/modules/payments/application/repositories/payment-read.repository';
import { GetPaymentsQuery } from './get-payments.query';

describe('GetPaymentsHandler', () => {
  let handler: GetPaymentsHandler;
  let repository: jest.Mocked<PaymentQueriesRepository>;

  beforeEach(async () => {
    const mockRepository = {
      getAll: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetPaymentsHandler,
        {
          provide: PaymentQueriesRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    handler = module.get<GetPaymentsHandler>(GetPaymentsHandler);
    repository = module.get(PaymentQueriesRepository);
  });

  it('should be defined', () => {
    expect(handler).toBeDefined();
  });

  it('should call repository.getAll with correct parameters', async () => {
    repository.getAll.mockResolvedValue([]);

    const query = new GetPaymentsQuery(
      { page: 1, per_page: 10 },
      'res-123',
      'COMPLETED',
    );

    await handler.execute(query);

    expect(repository.getAll).toHaveBeenCalledTimes(1);
    expect(repository.getAll).toHaveBeenCalledWith(
      expect.anything(), // paginationParams
      'res-123',
      'COMPLETED',
    );
  });

  it('should call repository.getAll without pagination params', async () => {
    repository.getAll.mockResolvedValue([]);

    const query = new GetPaymentsQuery(undefined, undefined, undefined);

    await handler.execute(query);

    expect(repository.getAll).toHaveBeenCalledTimes(1);
    expect(repository.getAll).toHaveBeenCalledWith(
      undefined,
      undefined,
      undefined,
    );
  });
});
