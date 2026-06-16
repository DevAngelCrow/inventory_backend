import { ProcessPaymentHandler } from '../../application/commands/process-payment/process-payment.handler';
import { VoidPaymentHandler } from '../../application/commands/void-payment/void-payment.handler';

export const commandHandlerProviders = [
  ProcessPaymentHandler,
  VoidPaymentHandler,
];
