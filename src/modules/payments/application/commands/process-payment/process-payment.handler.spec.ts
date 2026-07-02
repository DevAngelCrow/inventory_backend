import { Test, TestingModule } from '@nestjs/testing';
import { ProcessPaymentHandler } from './process-payment.handler';
import { PaymentRepository } from '@/modules/payments/domain/repositories/payment-repository';
import { PaymentGatewayPort } from '@/modules/payments/application/ports/payment-gateway.port';
import { ProcessPaymentCommand } from './process-payment.command';
import { Payment } from '@/modules/payments/domain/entities/payment';

describe('ProcessPaymentHandler', () => {
  let handler: ProcessPaymentHandler;
  let repository: jest.Mocked<PaymentRepository>;
  let paymentGateway: jest.Mocked<PaymentGatewayPort>;

  beforeEach(async () => {
    const mockRepository = {
      save: jest.fn().mockImplementation((payment) => payment),
    };

    const mockPaymentGateway = {
      process: jest.fn().mockResolvedValue({
        status: 'COMPLETED',
        gatewayProvider: 'TEST_GATEWAY',
        gatewayTxId: 'tx-12345',
        gatewayResponse: 'OK',
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProcessPaymentHandler,
        {
          provide: PaymentRepository,
          useValue: mockRepository,
        },
        {
          provide: PaymentGatewayPort,
          useValue: mockPaymentGateway,
        },
      ],
    }).compile();

    handler = module.get<ProcessPaymentHandler>(ProcessPaymentHandler);
    repository = module.get(PaymentRepository);
    paymentGateway = module.get(PaymentGatewayPort);
  });

  it('should be defined', () => {
    expect(handler).toBeDefined();
  });

  it('should process payment via gateway and save to repository', async () => {
    const paymentDate = new Date();
    const command = new ProcessPaymentCommand(
      '123e4567-e89b-12d3-a456-426614174000', // res-1
      '123e4567-e89b-12d3-a456-426614174001', // pm-1
      'CASH',
      100,
      'USD',
      paymentDate,
      'REF-123',
      'Test payment',
      '123e4567-e89b-12d3-a456-426614174002', // user-1
    );

    const result = await handler.execute(command);

    expect(paymentGateway.process).toHaveBeenCalledTimes(1);
    expect(paymentGateway.process).toHaveBeenCalledWith({
      amount: 100,
      currency: 'USD',
      paymentMethodCode: 'CASH',
      referenceNumber: 'REF-123',
    });

    expect(repository.save).toHaveBeenCalledTimes(1);
    const savedPayment = repository.save.mock.calls[0][0];

    expect(savedPayment.getIdReservation()).toBe(
      '123e4567-e89b-12d3-a456-426614174000',
    );
    expect(savedPayment.getAmount().value()).toBe(100);
    expect(savedPayment.getStatus().value()).toBe('COMPLETED');
    expect(savedPayment.getGatewayProvider()).toBe('TEST_GATEWAY');
    expect(savedPayment.getGatewayTxId()).toBe('tx-12345');

    // Result should be the saved payment
    expect(result).toBe(savedPayment);
  });
});
