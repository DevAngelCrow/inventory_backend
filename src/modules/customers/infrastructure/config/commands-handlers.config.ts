import { CreateCustomerHandler } from '../../application/commands/create-customer/create-customer.handler';
import { UpdateCustomerHandler } from '../../application/commands/update-customer/update-customer.handler';
import { DeleteCustomerHandler } from '../../application/commands/delete-customer/delete-customer.handler';

export const commandHandlerProviders = [
  CreateCustomerHandler,
  UpdateCustomerHandler,
  DeleteCustomerHandler,
];
