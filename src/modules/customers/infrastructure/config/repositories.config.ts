import { CustomerRepository } from '../../domain/repositories/customer-repository';
import { CustomerQueriesRepository } from '../../application/repositories/customer-read.repository';
import { ImplCustomerRepository } from '../implementation/customer/impl-customer.repository';

export const repositories = [
  { provide: CustomerRepository, useClass: ImplCustomerRepository },
  { provide: CustomerQueriesRepository, useClass: ImplCustomerRepository },
];
