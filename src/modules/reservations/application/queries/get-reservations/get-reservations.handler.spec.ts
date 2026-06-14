import { Test, TestingModule } from '@nestjs/testing';
import { GetReservationsHandler } from './get-reservations.handler';
import { ReservationQueriesRepository } from '@/modules/reservations/application/repositories/reservation-read.repository';
import { GetReservationsQuery } from './get-reservations.query';

describe('GetReservationsHandler', () => {
  let handler: GetReservationsHandler;
  let repository: jest.Mocked<ReservationQueriesRepository>;

  beforeEach(async () => {
    const mockRepository = {
      getAll: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetReservationsHandler,
        {
          provide: ReservationQueriesRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    handler = module.get<GetReservationsHandler>(GetReservationsHandler);
    repository = module.get(ReservationQueriesRepository);
  });

  it('should be defined', () => {
    expect(handler).toBeDefined();
  });

  it('should call repository.getAll with correct parameters', async () => {
    repository.getAll.mockResolvedValue([]);

    const query = new GetReservationsQuery(
      { page: 1, per_page: 10 },
      'cust-123',
      'PENDING',
      new Date('2026-06-01'),
      new Date('2026-06-30'),
    );

    await handler.execute(query);

    expect(repository.getAll).toHaveBeenCalledTimes(1);
    expect(repository.getAll).toHaveBeenCalledWith(
      expect.anything(), // paginationParams
      'cust-123',
      'PENDING',
      query.filter_date_start,
      query.filter_date_end,
    );
  });

  it('should call repository.getAll without pagination params', async () => {
    repository.getAll.mockResolvedValue([]);

    const query = new GetReservationsQuery(undefined, undefined, undefined, undefined, undefined);

    await handler.execute(query);

    expect(repository.getAll).toHaveBeenCalledTimes(1);
    expect(repository.getAll).toHaveBeenCalledWith(
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
    );
  });
});
