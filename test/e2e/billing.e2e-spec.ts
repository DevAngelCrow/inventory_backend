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
import { InvoiceProviderPort } from '@/modules/billing/application/ports/invoice-provider.port';

describe('Billing (e2e)', () => {
  let app: INestApplication<App>;
  let mockPrismaClient: MockPrismaClient;
  let mockInvoiceProvider: jest.Mocked<InvoiceProviderPort>;

  beforeAll(async () => {
    mockPrismaClient = createPrismaMock();
    const mockPrismaService = createPrismaServiceMock(mockPrismaClient);

    mockInvoiceProvider = {
      generate: jest.fn().mockResolvedValue({
        fiscalProvider: 'INTERNAL',
        fiscalId: null,
        fiscalStatus: 'NOT_APPLICABLE',
        fiscalResponse: null,
        pdfPath: '/pdfs/test.pdf',
      }),
    };

    jest
      .spyOn(JwtPassportAuthGuard.prototype, 'canActivate')
      .mockReturnValue(true);

    jest.spyOn(PermissionsGuard.prototype, 'canActivate').mockReturnValue(true);

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(mockPrismaService)
      .overrideProvider(InvoiceProviderPort)
      .useValue(mockInvoiceProvider)
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

  it('/invoices (POST) - should generate an invoice', () => {
    mockPrismaClient.mnt_invoice.create.mockResolvedValue({
      id: '123e4567-e89b-12d3-a456-426614174111',
    } as any);
    mockPrismaClient.mnt_invoice_line.createMany.mockResolvedValue({} as any);
    mockPrismaClient.mnt_invoice.findUniqueOrThrow.mockResolvedValue({
      id: '123e4567-e89b-12d3-a456-426614174111',
      invoice_number: 'INV-123',
      id_reservation: '123e4567-e89b-12d3-a456-426614174000',
      id_customer: '123e4567-e89b-12d3-a456-426614174001',
      id_currency: '123e4567-e89b-12d3-a456-426614174002',
      issue_date: new Date(),
      subtotal: 100,
      tax_rate: 16,
      tax_amount: 16,
      discount_amount: 0,
      delivery_fee: 0,
      damage_charges: 0,
      total: 116,
      status: 'ISSUED',
      mnt_invoice_line: [],
    } as any);

    return request(app.getHttpServer())
      .post('/billing/invoices')
      .send({
        id_reservation: '123e4567-e89b-12d3-a456-426614174000',
        id_customer: '123e4567-e89b-12d3-a456-426614174001',
        id_currency: '123e4567-e89b-12d3-a456-426614174002',
        issue_date: new Date().toISOString(),
        due_date: new Date().toISOString(),
        subtotal: 100,
        tax_rate: 16,
        tax_amount: 16,
        discount_amount: 0,
        delivery_fee: 0,
        damage_charges: 0,
        total: 116,
        status: 'ISSUED',
        notes: 'Test invoice',
        lines: [
          {
            description: 'Product 1',
            quantity: 2,
            unit_price: 50,
            subtotal: 100,
            tax_amount: 16,
            total: 116,
          },
        ],
      })
      .expect(201)
      .expect((res) => {
        expect(res.body.statusCode).toBe(201);
        expect(res.body.message).toBe('Invoice generated successfully');
      });
  });

  it('/billing/invoices (GET) - should return invoices list', () => {
    mockPrismaClient.mnt_invoice.findMany.mockResolvedValue([
      {
        id: '123e4567-e89b-12d3-a456-426614174112',
        id_reservation: '123e4567-e89b-12d3-a456-426614174000',
        id_customer: '123e4567-e89b-12d3-a456-426614174001',
        id_currency: '123e4567-e89b-12d3-a456-426614174002',
        invoice_number: 'INV-123456',
        issue_date: new Date(),
        subtotal: 100,
        tax_rate: 16,
        tax_amount: 16,
        discount_amount: 0,
        delivery_fee: 0,
        damage_charges: 0,
        total: 116,
        status: 'ISSUED',
        due_date: new Date(),
        notes: null,
        fiscal_provider: null,
        fiscal_id: null,
        fiscal_status: null,
        fiscal_response: null,
        pdf_path: null,
        id_created_by: null,
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
      },
    ] as any);

    mockPrismaClient.mnt_invoice.count.mockResolvedValue(1);

    return request(app.getHttpServer())
      .get('/billing/invoices?page=1&per_page=10')
      .expect(200)
      .expect((res) => {
        expect(res.body.statusCode).toBe(200);
        expect(res.body.data.data).toBeInstanceOf(Array);
        expect(res.body.data.data.length).toBe(1);
        expect(res.body.data.data[0].invoice_number).toBe('INV-123456');
      });
  });
});
