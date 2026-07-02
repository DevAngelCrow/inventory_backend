import { Test, TestingModule } from '@nestjs/testing';
import { GetInspectionsHandler } from './get-inspections.handler';
import { InspectionQueriesRepository } from '@/modules/inspections/application/repositories/inspection-read.repository';
import { GetInspectionsQuery } from './get-inspections.query';

describe('GetInspectionsHandler', () => {
  let handler: GetInspectionsHandler;
  let repository: jest.Mocked<InspectionQueriesRepository>;

  beforeEach(async () => {
    const mockRepository = {
      getAll: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetInspectionsHandler,
        {
          provide: InspectionQueriesRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    handler = module.get<GetInspectionsHandler>(GetInspectionsHandler);
    repository = module.get(InspectionQueriesRepository);
  });

  it('should be defined', () => {
    expect(handler).toBeDefined();
  });

  it('should call repository.getAll with correct parameters', async () => {
    repository.getAll.mockResolvedValue([]);

    const query = new GetInspectionsQuery(
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

    const query = new GetInspectionsQuery(undefined, undefined, undefined);

    await handler.execute(query);

    expect(repository.getAll).toHaveBeenCalledTimes(1);
    expect(repository.getAll).toHaveBeenCalledWith(
      undefined,
      undefined,
      undefined,
    );
  });
});
