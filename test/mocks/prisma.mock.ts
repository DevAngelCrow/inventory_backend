import { PrismaClient } from '../../generated/prisma/client';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { PrismaService } from '@/shared/infrastructure/persistence/prisma/prisma.service';

export type MockPrismaClient = DeepMockProxy<PrismaClient>;

export const createPrismaMock = (): MockPrismaClient => {
  return mockDeep<PrismaClient>();
};

export const createPrismaServiceMock = (
  mockClient: MockPrismaClient,
): PrismaService => {
  const service = Object.create(PrismaService.prototype) as PrismaService;
  service.onModuleInit = jest.fn();
  service.onModuleDestroy = jest.fn();
  Object.defineProperty(service, 'client', {
    get: jest.fn(() => mockClient),
    configurable: true,
  });
  service.$transaction = jest
    .fn()
    .mockImplementation(async (callback: unknown): Promise<unknown> => {
      if (typeof callback === 'function') {
        return callback(mockClient);
      }
      if (Array.isArray(callback)) {
        return Promise.all(callback);
      }
      return [];
    });
  return service;
};
