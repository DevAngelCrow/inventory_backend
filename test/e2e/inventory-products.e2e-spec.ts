import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '@/shared/infrastructure/persistence/prisma/prisma.service';
import { JwtPassportAuthGuard } from '@/modules/auth/infrastructure/guards/jwt-passport-auth.guard';
import { PermissionsGuard } from '@/modules/security/infrastructure/guards/permissions.guard';
import { createPrismaMock, createPrismaServiceMock, MockPrismaClient } from '../mocks/prisma.mock';

describe('Inventory Products (e2e)', () => {
  let app: INestApplication;
  let mockPrismaClient: MockPrismaClient;

  beforeAll(async () => {
    mockPrismaClient = createPrismaMock();
    const mockPrismaService = createPrismaServiceMock(mockPrismaClient);

    jest
      .spyOn(JwtPassportAuthGuard.prototype, 'canActivate')
      .mockReturnValue(true);

    jest
      .spyOn(PermissionsGuard.prototype, 'canActivate')
      .mockReturnValue(true);

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

  it('/inventory/products (POST) - should create a product', () => {
    mockPrismaClient.mnt_product.create.mockResolvedValue({} as any);

    return request(app.getHttpServer())
      .post('/inventory/products')
      .send({
        sku: 'SKU-001',
        name: 'Laptop HP',
        rental_price: 25.5,
        total_stock: 10,
        category_id: '123e4567-e89b-12d3-a456-426614174000',
        description: 'A nice laptop',
      })
      .expect(201)
      .expect((res) => {
        expect(res.body.statusCode).toBe(201);
        expect(res.body.message).toBe('Product created successfully');
      });
  });

  it('/inventory/products (GET) - should return products list', () => {
    mockPrismaClient.mnt_product.findMany.mockResolvedValue([
      {
        id: 'prod-1',
        sku: 'SKU-001',
        name: 'Laptop HP',
        description: 'A nice laptop',
        rental_price: 25.5,
        replacement_cost: null,
        total_stock: 10,
        min_stock_alert: 2,
        category_id: '123e4567-e89b-12d3-a456-426614174000',
        color: null,
        dimensions: null,
        weight_lbs: null,
        image_url: null,
        notes: null,
        active: true,
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
        ctl_product_category: {
          id: '123e4567-e89b-12d3-a456-426614174000',
          name: 'Electronics'
        }
      },
    ] as any);
    
    mockPrismaClient.mnt_product.count.mockResolvedValue(1);

    return request(app.getHttpServer())
      .get('/inventory/products?page=1&per_page=10')
      .expect(200)
      .expect((res) => {
        expect(res.body.statusCode).toBe(200);
        expect(res.body.data.data).toBeInstanceOf(Array);
        expect(res.body.data.data.length).toBe(1);
        expect(res.body.data.data[0].sku).toBe('SKU-001');
      });
  });
});
