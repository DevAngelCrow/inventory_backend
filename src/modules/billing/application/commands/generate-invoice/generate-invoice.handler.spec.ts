import { Test, TestingModule } from '@nestjs/testing';
import { GenerateInvoiceHandler } from './generate-invoice.handler';
import { InvoiceRepository } from '@/modules/billing/domain/repositories/invoice-repository';
import { InvoiceProviderPort } from '@/modules/billing/application/ports/invoice-provider.port';
import { GenerateInvoiceCommand } from './generate-invoice.command';
import { Invoice } from '@/modules/billing/domain/entities/invoice';

describe('GenerateInvoiceHandler', () => {
  let handler: GenerateInvoiceHandler;
  let repository: jest.Mocked<InvoiceRepository>;
  let invoiceProvider: jest.Mocked<InvoiceProviderPort>;

  beforeEach(async () => {
    const mockRepository = {
      save: jest.fn().mockImplementation((invoice) => invoice),
    };

    const mockInvoiceProvider = {
      generate: jest.fn().mockResolvedValue({
        fiscalProvider: 'INTERNAL',
        fiscalId: null,
        fiscalStatus: 'NOT_APPLICABLE',
        fiscalResponse: null,
        pdfPath: '/pdfs/test.pdf',
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GenerateInvoiceHandler,
        {
          provide: InvoiceRepository,
          useValue: mockRepository,
        },
        {
          provide: InvoiceProviderPort,
          useValue: mockInvoiceProvider,
        },
      ],
    }).compile();

    handler = module.get<GenerateInvoiceHandler>(GenerateInvoiceHandler);
    repository = module.get(InvoiceRepository);
    invoiceProvider = module.get(InvoiceProviderPort);
  });

  it('should be defined', () => {
    expect(handler).toBeDefined();
  });

  it('should generate an invoice and save it to repository', async () => {
    const issueDate = new Date();
    const command = new GenerateInvoiceCommand(
      '123e4567-e89b-12d3-a456-426614174000', // res
      '123e4567-e89b-12d3-a456-426614174001', // cust
      '123e4567-e89b-12d3-a456-426614174002', // cur
      issueDate,
      issueDate, // due_date
      100, // subtotal
      16, // tax_rate
      16, // tax_amount
      0, // discount_amount
      0, // delivery_fee
      0, // damage_charges
      116, // total
      'ISSUED', // status
      'Notes', // notes
      '123e4567-e89b-12d3-a456-426614174003', // id_created_by
      [
        {
          description: 'Product 1',
          quantity: 2,
          unit_price: 50,
          subtotal: 100,
          tax_amount: 16,
          total: 116,
        },
      ],
    );

    const result = await handler.execute(command);

    expect(invoiceProvider.generate).toHaveBeenCalledTimes(1);
    expect(repository.save).toHaveBeenCalledTimes(1);

    const savedInvoice = repository.save.mock.calls[0][0];

    expect(savedInvoice.getIdReservation()).toBe(
      '123e4567-e89b-12d3-a456-426614174000',
    );
    expect(savedInvoice.getIdCustomer()).toBe(
      '123e4567-e89b-12d3-a456-426614174001',
    );
    expect(savedInvoice.getAmount().total).toBe(116);
    expect(savedInvoice.getStatus().value()).toBe('ISSUED');
    expect(savedInvoice.getFiscalProvider()).toBe('INTERNAL');

    expect(result).toBe(savedInvoice);
  });
});
