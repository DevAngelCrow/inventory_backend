import { Test, TestingModule } from '@nestjs/testing';
import { CreateReservationHandler } from './create-reservation.handler';
import { ReservationRepository } from '@/modules/reservations/domain/repositories/reservation-repository';
import { CreateReservationCommand, CreateReservationItemCommand } from './create-reservation.command';
import { Reservation } from '@/modules/reservations/domain/entities/reservation';

describe('CreateReservationHandler', () => {
  let handler: CreateReservationHandler;
  let repository: jest.Mocked<ReservationRepository>;

  beforeEach(async () => {
    const mockRepository = {
      create: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateReservationHandler,
        {
          provide: ReservationRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    handler = module.get<CreateReservationHandler>(CreateReservationHandler);
    repository = module.get(ReservationRepository);
  });

  it('should be defined', () => {
    expect(handler).toBeDefined();
  });

  it('should call repository.create with correct reservation entity', async () => {
    const start = new Date();
    const end = new Date(start.getTime() + 1000 * 60 * 60 * 2); // 2 hours later
    const command = new CreateReservationCommand(
      'cust-123',
      start,
      end,
      100,
      [new CreateReservationItemCommand('prod-1', 2, 50, 100)],
      '123 Main St',
      20,
      80,
      'Handle with care',
    );

    await handler.execute(command);

    expect(repository.create).toHaveBeenCalledTimes(1);
    const createdReservation = repository.create.mock.calls[0][0] as Reservation;
    
    expect(createdReservation.getIdCustomer()).toBe('cust-123');
    expect(createdReservation.getStatus().value()).toBe('PENDING');
    expect(createdReservation.getAmount().total).toBe(100);
    expect(createdReservation.getAmount().deposit).toBe(20);
    expect(createdReservation.getAmount().balance).toBe(80);
    expect(createdReservation.getDeliveryAddress().value()).toBe('123 Main St');
    expect(createdReservation.getNotes().value()).toBe('Handle with care');
    
    const items = createdReservation.getItems();
    expect(items.length).toBe(1);
    expect(items[0].getIdProduct()).toBe('prod-1');
    expect(items[0].getQuantity().value()).toBe(2);
    expect(items[0].getPrice().unitPrice).toBe(50);
    expect(items[0].getPrice().totalPrice).toBe(100);
  });
});
