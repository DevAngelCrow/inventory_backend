import { PaymentRepository } from '../../domain/repositories/payment-repository';
import { PaymentQueriesRepository } from '../../application/repositories/payment-read.repository';
import { ImplPaymentRepository } from '../implementation/payment/impl-payment.repository';

export const repositories = [
  { provide: PaymentRepository, useClass: ImplPaymentRepository },
  { provide: PaymentQueriesRepository, useClass: ImplPaymentRepository },
];
