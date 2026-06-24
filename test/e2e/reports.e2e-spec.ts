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

describe('Reports (e2e)', () => {
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

  it('/reports/revenue (GET) - should return revenue report', () => {
    mockPrismaClient.mnt_invoice.findMany.mockResolvedValue([
      { total: 100 },
      { total: 200 },
      { total: 300 },
    ] as any);

    return request(app.getHttpServer())
      .get('/reports/revenue?start_date=2023-01-01&end_date=2023-12-31')
      .expect(200)
      .expect((res) => {
        expect(res.body.statusCode).toBe(200);
        expect(res.body.data.total_revenue).toBe(600);
        expect(res.body.data.total_invoices).toBe(3);
      });
  });
});
