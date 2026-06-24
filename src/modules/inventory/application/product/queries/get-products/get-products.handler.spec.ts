import { Test, TestingModule } from '@nestjs/testing';
import { GetProductsHandler } from './get-products.handler';
import { ProductQueriesRepository } from '@/modules/inventory/application/repositories/product-read.repository';
import { GetProductsQuery } from './get-products.query';

describe('GetProductsHandler', () => {
  let handler: GetProductsHandler;
  let repository: jest.Mocked<ProductQueriesRepository>;

  beforeEach(async () => {
    const mockRepository = {
      getAll: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetProductsHandler,
        {
          provide: ProductQueriesRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    handler = module.get<GetProductsHandler>(GetProductsHandler);
    repository = module.get(ProductQueriesRepository);
  });

  it('should be defined', () => {
    expect(handler).toBeDefined();
  });

  it('should call repository.getAll with correct parameters', async () => {
    repository.getAll.mockResolvedValue([]);

    const query = new GetProductsQuery(
      { page: 1, per_page: 10 },
      'Test',
      'SKU-1',
      'cat-1',
      true,
    );

    await handler.execute(query);

    expect(repository.getAll).toHaveBeenCalledTimes(1);
    expect(repository.getAll).toHaveBeenCalledWith(
      expect.anything(), // paginationParams
      'Test',
      'SKU-1',
      'cat-1',
      true,
    );
  });

  it('should call repository.getAll without pagination params', async () => {
    repository.getAll.mockResolvedValue([]);

    const query = new GetProductsQuery(
      undefined,
      undefined,
      undefined,
      undefined,
      true,
    );

    await handler.execute(query);

    expect(repository.getAll).toHaveBeenCalledTimes(1);
    expect(repository.getAll).toHaveBeenCalledWith(
      undefined,
      undefined,
      undefined,
      undefined,
      true,
    );
  });
});
