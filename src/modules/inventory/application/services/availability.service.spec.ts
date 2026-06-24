import { Test, TestingModule } from '@nestjs/testing';
import { AvailabilityService } from './availability.service';
import { PrismaService } from '@/shared/infrastructure/persistence/prisma/prisma.service';
import {
  createPrismaMock,
  createPrismaServiceMock,
  MockPrismaClient,
} from '../../../../../test/mocks/prisma.mock';

describe('AvailabilityService', () => {
  let service: AvailabilityService;
  let mockPrismaClient: MockPrismaClient;

  beforeEach(async () => {
    mockPrismaClient = createPrismaMock();
    const mockPrismaService = createPrismaServiceMock(mockPrismaClient);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AvailabilityService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<AvailabilityService>(AvailabilityService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAvailableStock', () => {
    it('should return 0 if product does not exist', async () => {
      mockPrismaClient.mnt_product.findUnique.mockResolvedValue(null);

      const available = await service.getAvailableStock(
        'prod-1',
        new Date(),
        new Date(),
      );

      expect(available).toBe(0);
    });

    it('should return 0 if product is inactive', async () => {
      mockPrismaClient.mnt_product.findUnique.mockResolvedValue({
        total_stock: 100,
        active: false,
      } as any);

      const available = await service.getAvailableStock(
        'prod-1',
        new Date(),
        new Date(),
      );

      expect(available).toBe(0);
    });

    it('should return total stock if no reservations overlap', async () => {
      mockPrismaClient.mnt_product.findUnique.mockResolvedValue({
        total_stock: 100,
        active: true,
      } as any);

      mockPrismaClient.mnt_reservation_item.aggregate.mockResolvedValue({
        _sum: { quantity: null },
      } as any);

      const available = await service.getAvailableStock(
        'prod-1',
        new Date(),
        new Date(),
      );

      expect(available).toBe(100);
    });

    it('should calculate correct available stock with overlaps', async () => {
      mockPrismaClient.mnt_product.findUnique.mockResolvedValue({
        total_stock: 100,
        active: true,
      } as any);

      mockPrismaClient.mnt_reservation_item.aggregate.mockResolvedValue({
        _sum: { quantity: 30 },
      } as any);

      const available = await service.getAvailableStock(
        'prod-1',
        new Date('2026-07-01'),
        new Date('2026-07-05'),
      );

      expect(available).toBe(70);
      expect(
        mockPrismaClient.mnt_reservation_item.aggregate,
      ).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            id_product: 'prod-1',
          }),
        }),
      );
    });

    it('should return 0 if reservations exceed total stock somehow', async () => {
      mockPrismaClient.mnt_product.findUnique.mockResolvedValue({
        total_stock: 50,
        active: true,
      } as any);

      mockPrismaClient.mnt_reservation_item.aggregate.mockResolvedValue({
        _sum: { quantity: 60 },
      } as any);

      const available = await service.getAvailableStock(
        'prod-1',
        new Date(),
        new Date(),
      );

      expect(available).toBe(0);
    });
  });

  describe('isAvailable', () => {
    it('should return true if available stock is >= requested quantity', async () => {
      jest.spyOn(service, 'getAvailableStock').mockResolvedValue(50);

      const result = await service.isAvailable(
        'prod-1',
        20,
        new Date(),
        new Date(),
      );

      expect(result).toBe(true);
    });

    it('should return false if available stock is < requested quantity', async () => {
      jest.spyOn(service, 'getAvailableStock').mockResolvedValue(10);

      const result = await service.isAvailable(
        'prod-1',
        20,
        new Date(),
        new Date(),
      );

      expect(result).toBe(false);
    });
  });
});
