import { Test, TestingModule } from '@nestjs/testing';
import { RecordInspectionHandler } from './record-inspection.handler';
import { InspectionRepository } from '@/modules/reservations/inspections/domain/repositories/inspection-repository';
import { RecordInspectionCommand } from './record-inspection.command';
import { Inspection } from '@/modules/reservations/inspections/domain/entities/inspection';

describe('RecordInspectionHandler', () => {
  let handler: RecordInspectionHandler;
  let repository: jest.Mocked<InspectionRepository>;

  beforeEach(async () => {
    const mockRepository = {
      save: jest.fn().mockResolvedValue(undefined),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RecordInspectionHandler,
        {
          provide: InspectionRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    handler = module.get<RecordInspectionHandler>(RecordInspectionHandler);
    repository = module.get(InspectionRepository);
  });

  it('should be defined', () => {
    expect(handler).toBeDefined();
  });

  it('should create an inspection and save it via repository', async () => {
    const inspectionDate = new Date();
    const command = new RecordInspectionCommand(
      '123e4567-e89b-12d3-a456-426614174000', // res
      inspectionDate,
      'GOOD',
      'COMPLETED',
      [
        {
          id_product: '123e4567-e89b-12d3-a456-426614174001',
          damage_type: 'NONE',
          description: '',
          quantity_affected: 1,
          charge_amount: 0,
        },
      ],
      'Everything looks fine',
      0,
      '123e4567-e89b-12d3-a456-426614174002', // user
    );

    await handler.execute(command);

    expect(repository.save).toHaveBeenCalledTimes(1);

    const savedInspection = repository.save.mock.calls[0][0];

    expect(savedInspection.getIdReservation()).toBe(
      '123e4567-e89b-12d3-a456-426614174000',
    );
    expect(savedInspection.getOverallCondition()).toBe('GOOD');
    expect(savedInspection.getStatus().value()).toBe('COMPLETED');
    expect(savedInspection.getTotalCharges()).toBe(0);

    const items = savedInspection.getDamageItems();
    expect(items.length).toBe(1);
    expect(items[0].getIdProduct()).toBe(
      '123e4567-e89b-12d3-a456-426614174001',
    );
    expect(items[0].getDamageType()).toBe('NONE');
  });
});
