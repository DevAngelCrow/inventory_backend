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

describe('Inventory Categories (e2e)', () => {
  let app: INestApplication<App>;
  let mockPrismaClient: MockPrismaClient;

  beforeEach(async () => {
    mockPrismaClient = createPrismaMock();
    const mockPrismaService = createPrismaServiceMock(mockPrismaClient);

    jest
      .spyOn(JwtPassportAuthGuard.prototype, 'canActivate')
      .mockImplementation((context) => {
        const req = context.switchToHttp().getRequest();
        req.user = {
          id: 'test-user',
          permissions: [
            'crear-categoria-producto',
            'listar-categorias-producto',
          ],
        };
        return true;
      });
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

  afterEach(async () => {
    await app.close();
  });

  it('/inventory/categories (POST) - should create a category', () => {
    mockPrismaClient.ctl_product_category.create.mockResolvedValue({
      id: 'test-id',
      name: 'Electronics',
      description: 'Devices',
      icon: 'icon-tv',
      active: true,
      created_at: new Date(),
      updated_at: new Date(),
      deleted_at: null,
    });

    return request(app.getHttpServer())
      .post('/inventory/categories')
      .send({
        name: 'Electronics',
        description: 'Devices',
        icon: 'icon-tv',
      })
      .expect(201)
      .expect((res) => {
        expect(res.body.statusCode).toBe(201);
        expect(res.body.message).toBe('Product category created successfully');
      });
  });

  it('/inventory/categories (GET) - should return categories list', () => {
    mockPrismaClient.ctl_product_category.findMany.mockResolvedValue([
      {
        id: 'test-id',
        name: 'Electronics',
        description: 'Devices',
        icon: 'icon-tv',
        active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ] as any);

    mockPrismaClient.ctl_product_category.count.mockResolvedValue(1);

    return request(app.getHttpServer())
      .get('/inventory/categories?page=1&per_page=10')
      .expect(200)
      .expect((res) => {
        expect(res.body.statusCode).toBe(200);
        expect(res.body.data.data).toBeInstanceOf(Array);
        expect(res.body.data.data.length).toBe(1);
        expect(res.body.data.data[0].name).toBe('Electronics');
      });
  });
});
