import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateCustomerCommand } from './create-customer.command';
import { CustomerRepository } from '@/modules/customers/domain/repositories/customer-repository';
import { Customer } from '@/modules/customers/domain/entities/customer';

@CommandHandler(CreateCustomerCommand)
export class CreateCustomerHandler implements ICommandHandler<CreateCustomerCommand> {
  constructor(private readonly repository: CustomerRepository) {}

  async execute(command: CreateCustomerCommand): Promise<void> {
    const customer = Customer.create({
      first_name: command.first_name,
      last_name: command.last_name,
      phone: command.phone,
      email: command.email,
      phone_secondary: command.phone_secondary,
      company_name: command.company_name,
      tax_id: command.tax_id,
      address_line1: command.address_line1,
      address_line2: command.address_line2,
      city: command.city,
      state: command.state,
      zip_code: command.zip_code,
      notes: command.notes,
      id_user: command.id_user,
      active: true,
    });
    await this.repository.create(customer);
  }
}
