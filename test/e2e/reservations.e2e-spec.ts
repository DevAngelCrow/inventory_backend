import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '@/shared/infrastructure/persistence/prisma/prisma.service';
import { JwtPassportAuthGuard } from '@/modules/auth/infrastructure/guards/jwt-passport-auth.guard';
import { PermissionsGuard } from '@/modules/security/infrastructure/guards/permissions.guard';
import {
  createPrismaMock,
  createPrismaServiceMock,
  MockPrismaClient,
} from '../mocks/prisma.mock';

describe('Reservations (e2e)', () => {
  let app: INestApplication;
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

  it('/reservations/reservations (POST) - should create a reservation', () => {
    mockPrismaClient.mnt_reservation.create.mockResolvedValue({} as any);

    return request(app.getHttpServer())
      .post('/reservations/reservations')
      .send({
        id_customer: '123e4567-e89b-12d3-a456-426614174000',
        event_start: new Date().toISOString(),
        event_end: new Date(
          new Date().getTime() + 1000 * 60 * 60 * 2,
        ).toISOString(),
        total_amount: 100,
        items: [
          {
            id_product: '123e4567-e89b-12d3-a456-426614174001',
            quantity: 2,
            unit_price: 50,
            total_price: 100,
          },
        ],
      })
      .expect(201)
      .expect((res) => {
        expect(res.body.statusCode).toBe(201);
        expect(res.body.message).toBe('Reservation created successfully');
      });
  });

  it('/reservations/reservations (GET) - should return reservations list', () => {
    mockPrismaClient.mnt_reservation.findMany.mockResolvedValue([
      {
        id: 'res-1',
        id_customer: '123e4567-e89b-12d3-a456-426614174000',
        status: 'PENDING',
        event_start: new Date(),
        event_end: new Date(),
        delivery_address: null,
        total_amount: 100,
        deposit_amount: null,
        balance_due: null,
        notes: null,
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
        mnt_customer: {
          first_name: 'John',
          last_name: 'Doe',
        },
        dtl_reservation_item: [],
      },
    ] as any);

    mockPrismaClient.mnt_reservation.count.mockResolvedValue(1);

    return request(app.getHttpServer())
      .get('/reservations/reservations?page=1&per_page=10')
      .expect(200)
      .expect((res) => {
        expect(res.body.statusCode).toBe(200);
        expect(res.body.data.data).toBeInstanceOf(Array);
        expect(res.body.data.data.length).toBe(1);
        expect(res.body.data.data[0].id_customer).toBe(
          '123e4567-e89b-12d3-a456-426614174000',
        );
      });
  });
});
