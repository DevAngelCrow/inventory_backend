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

describe('Customers (e2e)', () => {
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

  it('/customers (POST) - should create a customer', () => {
    mockPrismaClient.mnt_customer.create.mockResolvedValue({} as any);

    return request(app.getHttpServer())
      .post('/customers/customers')
      .send({
        first_name: 'Jane',
        last_name: 'Doe',
        phone: '+198765432',
        email: 'jane@example.com',
        company_name: 'Jane LLC',
      })
      .expect(201)
      .expect((res) => {
        expect(res.body.statusCode).toBe(201);
        expect(res.body.message).toBe('Customer created successfully');
      });
  });

  it('/customers (GET) - should return customers list', () => {
    mockPrismaClient.mnt_customer.findMany.mockResolvedValue([
      {
        id: 'cust-1',
        first_name: 'Jane',
        last_name: 'Doe',
        phone: '+198765432',
        email: 'jane@example.com',
        phone_secondary: null,
        company_name: 'Jane LLC',
        tax_id: null,
        address_line1: null,
        address_line2: null,
        city: null,
        state: null,
        zip_code: null,
        notes: null,
        active: true,
        id_user: null,
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
      },
    ] as any);

    mockPrismaClient.mnt_customer.count.mockResolvedValue(1);

    return request(app.getHttpServer())
      .get('/customers/customers?page=1&per_page=10')
      .expect(200)
      .expect((res) => {
        expect(res.body.statusCode).toBe(200);
        expect(res.body.data.data).toBeInstanceOf(Array);
        expect(res.body.data.data.length).toBe(1);
        expect(res.body.data.data[0].first_name).toBe('Jane');
      });
  });
});
