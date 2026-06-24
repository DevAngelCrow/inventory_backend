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
  const service = mockClient as unknown as PrismaService;
  (service as any).onModuleInit = jest.fn();
  (service as any).onModuleDestroy = jest.fn();
  Object.defineProperty(service, 'client', {
    get: jest.fn(() => mockClient),
    configurable: true,
  });
  service.$transaction = jest.fn().mockImplementation(async (callback) => {
    if (typeof callback === 'function') {
      return callback(mockClient);
    }
    if (Array.isArray(callback)) {
      return Promise.all(callback);
    }
    return [];
  }) as any;
  return service;
};
