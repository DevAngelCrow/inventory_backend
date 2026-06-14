import { GetCustomersHandler } from '../../application/queries/get-customers/get-customers.handler';
import { GetCustomerHandler } from '../../application/queries/get-customer/get-customer.handler';

export const queryHandlerProviders = [
  GetCustomersHandler,
  GetCustomerHandler,
];
