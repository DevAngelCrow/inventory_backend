import { Payment } from '../entities/payment';

export abstract class PaymentRepository {
  abstract save(payment: Payment): Promise<Payment>;
}
