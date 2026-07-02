import { PaymentGatewayPort } from '../../application/ports/payment-gateway.port';
import { CashPaymentGateway } from '../gateways/cash-payment.gateway';

export const gatewayProviders = [
  { provide: PaymentGatewayPort, useClass: CashPaymentGateway },
];
