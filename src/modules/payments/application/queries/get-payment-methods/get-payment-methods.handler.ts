import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetPaymentMethodsQuery } from './get-payment-methods.query';
import { PaymentQueriesRepository } from '@/modules/payments/application/repositories/payment-read.repository';

@QueryHandler(GetPaymentMethodsQuery)
export class GetPaymentMethodsHandler implements IQueryHandler<GetPaymentMethodsQuery> {
  constructor(private readonly repository: PaymentQueriesRepository) {}

  async execute(query: GetPaymentMethodsQuery): Promise<any[]> {
    return await this.repository.getMethods();
  }
}
