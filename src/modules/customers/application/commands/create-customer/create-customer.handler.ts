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
      middle_name: command.middle_name,
      last_name: command.last_name,
      phone: command.phone,
      email: command.email,
      phone_secondary: command.phone_secondary,
      company_name: command.company_name,
      tax_id: command.tax_id,
      notes: command.notes,
      id_country: command.id_country,
      addresses: command.addresses ? command.addresses.map(a => ({
        ...a,
        is_primary: a.is_primary ?? false,
      })) : [],
      active: true,
    });
    await this.repository.create(customer);
  }
}
