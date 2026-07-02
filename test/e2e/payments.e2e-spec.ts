import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '@/shared/infrastructure/persistence/prisma/prisma.service';
import { JwtPassportAuthGuard } from '@/modules/auth/infrastructure/guards/jwt-passport-auth.guard';
import { PermissionsGuard } from '@/modules/security/infrastructure/guards/permissions.guard';
import {
  createPrismaMock,
  createPrismaServiceMock,
  MockPrismaClient,
} from '../mocks/prisma.mock';

describe('Payments (e2e)', () => {
  let app: INestApplication<App>;
  let mockPrismaClient: MockPrismaClient;

  beforeAll(async () => {
    mockPrismaClient = createPrismaMock();
    const mockPrismaService = createPrismaServiceMock(mockPrismaClient);

    jest
      .spyOn(JwtPassportAuthGuard.prototype, 'canActivate')
      .mockReturnValue(true);

    jest.spyOn(PermissionsGuard.prototype, 'canActivate').mockReturnValue(true);

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(mockPrismaService)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/payments/payments (POST) - should process a payment', () => {
    mockPrismaClient.mnt_payment.create.mockResolvedValue({
      id: '123e4567-e89b-12d3-a456-426614174003',
      id_reservation: '123e4567-e89b-12d3-a456-426614174000',
      id_payment_method: '123e4567-e89b-12d3-a456-426614174001',
      amount: 100,
      payment_date: new Date(),
      status: 'COMPLETED',
    } as any);

    return request(app.getHttpServer())
      .post('/payments/payments')
      .send({
        id_reservation: '123e4567-e89b-12d3-a456-426614174000',
        id_payment_method: '123e4567-e89b-12d3-a456-426614174001',
        payment_method_code: 'CASH',
        amount: 100,
        id_currency: '123e4567-e89b-12d3-a456-426614174002',
        payment_date: new Date().toISOString(),
      })
      .expect(201)
      .expect((res) => {
        expect(res.body.statusCode).toBe(201);
        expect(res.body.message).toBe('Payment processed successfully');
      });
  });

  it('/payments/payments (GET) - should return payments list', () => {
    mockPrismaClient.mnt_payment.findMany.mockResolvedValue([
      {
        id: 'pay-1',
        id_reservation: '123e4567-e89b-12d3-a456-426614174000',
        id_payment_method: '123e4567-e89b-12d3-a456-426614174001',
        amount: 100,
        payment_date: new Date(),
        status: 'COMPLETED',
        reference_number: null,
        notes: null,
        gateway_provider: null,
        gateway_tx_id: null,
        gateway_response: null,
        id_received_by: null,
        payment_number: 1,
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
      },
    ] as any);

    mockPrismaClient.mnt_payment.count.mockResolvedValue(1);

    return request(app.getHttpServer())
      .get('/payments/payments?page=1&per_page=10')
      .expect(200)
      .expect((res) => {
        expect(res.body.statusCode).toBe(200);
        expect(res.body.data.data).toBeInstanceOf(Array);
        expect(res.body.data.data.length).toBe(1);
        expect(res.body.data.data[0].id_reservation).toBe(
          '123e4567-e89b-12d3-a456-426614174000',
        );
      });
  });
});
