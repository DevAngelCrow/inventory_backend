import { Test, TestingModule } from '@nestjs/testing';
import { GetCustomersHandler } from './get-customers.handler';
import { CustomerQueriesRepository } from '@/modules/customers/application/repositories/customer-read.repository';
import { GetCustomersQuery } from './get-customers.query';

describe('GetCustomersHandler', () => {
  let handler: GetCustomersHandler;
  let repository: jest.Mocked<CustomerQueriesRepository>;

  beforeEach(async () => {
    const mockRepository = {
      getAll: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetCustomersHandler,
        {
          provide: CustomerQueriesRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    handler = module.get<GetCustomersHandler>(GetCustomersHandler);
    repository = module.get(CustomerQueriesRepository);
  });

  it('should be defined', () => {
    expect(handler).toBeDefined();
  });

  it('should call repository.getAll with correct parameters', async () => {
    repository.getAll.mockResolvedValue([]);

    const query = new GetCustomersQuery(
      { page: 1, per_page: 10 },
      'John',
      'john@example.com',
      true,
    );

    await handler.execute(query);

    expect(repository.getAll).toHaveBeenCalledTimes(1);
    expect(repository.getAll).toHaveBeenCalledWith(
      expect.anything(), // paginationParams
      'John',
      'john@example.com',
      true,
    );
  });

  it('should call repository.getAll without pagination params', async () => {
    repository.getAll.mockResolvedValue([]);

    const query = new GetCustomersQuery(undefined, undefined, undefined, true);

    await handler.execute(query);

    expect(repository.getAll).toHaveBeenCalledTimes(1);
    expect(repository.getAll).toHaveBeenCalledWith(
      undefined,
      undefined,
      undefined,
      true,
    );
  });
});
