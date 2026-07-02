import { GetPaymentsHandler } from '../../application/queries/get-payments/get-payments.handler';
import { GetPaymentMethodsHandler } from '../../application/queries/get-payment-methods/get-payment-methods.handler';

export const queryHandlerProviders = [
  GetPaymentsHandler,
  GetPaymentMethodsHandler,
];
