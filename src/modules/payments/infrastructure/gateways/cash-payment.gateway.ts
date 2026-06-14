import { Injectable } from '@nestjs/common';
import {
  PaymentGatewayPort,
  ProcessPaymentParams,
  ProcessPaymentResult,
} from '@/modules/payments/application/ports/payment-gateway.port';

@Injectable()
export class CashPaymentGateway implements PaymentGatewayPort {
  async process(params: ProcessPaymentParams): Promise<ProcessPaymentResult> {
    // Para pagos en efectivo, el procesamiento es inmediato y siempre exitoso
    // a menos que haya alguna validación de negocio.
    return {
      status: 'COMPLETED',
      gatewayProvider: 'CASH_LOCAL',
      gatewayTxId: `CASH-${Date.now()}`,
      gatewayResponse: {
        method: params.paymentMethodCode,
        amount: params.amount,
        currency: params.currency,
        processedAt: new Date().toISOString(),
      },
    };
  }
}
