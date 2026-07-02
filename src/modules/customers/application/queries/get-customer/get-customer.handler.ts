import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCustomerQuery } from './get-customer.query';
import { CustomerQueriesRepository } from '@/modules/customers/application/repositories/customer-read.repository';
import { CustomerDto } from '@/modules/customers/application/dtos/customer.dto';

@QueryHandler(GetCustomerQuery)
export class GetCustomerHandler implements IQueryHandler<GetCustomerQuery> {
  constructor(private readonly repository: CustomerQueriesRepository) {}

  async execute(query: GetCustomerQuery): Promise<CustomerDto | null> {
    return await this.repository.findById(query.id);
  }
}
