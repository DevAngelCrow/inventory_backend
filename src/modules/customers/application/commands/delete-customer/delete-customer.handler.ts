import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteCustomerCommand } from './delete-customer.command';
import { CustomerRepository } from '@/modules/customers/domain/repositories/customer-repository';
import { CustomerId } from '@/modules/customers/domain/value-objects/customer-id';
import { Customer } from '@/modules/customers/domain/entities/customer';

@CommandHandler(DeleteCustomerCommand)
export class DeleteCustomerHandler implements ICommandHandler<DeleteCustomerCommand> {
  constructor(private readonly repository: CustomerRepository) {}

  async execute(command: DeleteCustomerCommand): Promise<Customer> {
    const id = new CustomerId(command.id);
    return await this.repository.toggleStatus(id);
  }
}
