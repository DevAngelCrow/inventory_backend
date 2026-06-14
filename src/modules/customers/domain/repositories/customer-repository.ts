import { Customer } from '../entities/customer';
import { CustomerId } from '../value-objects/customer-id';

export abstract class CustomerRepository {
  abstract create(customer: Customer): Promise<void>;
  abstract update(customer: Customer): Promise<void>;
  abstract toggleStatus(id: CustomerId): Promise<Customer>;
}
