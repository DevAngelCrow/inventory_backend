import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateCustomerCommand } from './update-customer.command';
import { CustomerRepository } from '@/modules/customers/domain/repositories/customer-repository';
import { CustomerQueriesRepository } from '@/modules/customers/application/repositories/customer-read.repository';
import { Customer } from '@/modules/customers/domain/entities/customer';
import { NotFoundException } from '@/shared/domain/exceptions/not-found.exception';

@CommandHandler(UpdateCustomerCommand)
export class UpdateCustomerHandler implements ICommandHandler<UpdateCustomerCommand> {
  constructor(
    private readonly repository: CustomerRepository,
    private readonly queryRepository: CustomerQueriesRepository,
  ) {}

  async execute(command: UpdateCustomerCommand): Promise<void> {
    const existing = await this.queryRepository.findById(command.id);
    if (!existing) {
      throw new NotFoundException('Customer', command.id);
    }
    const customer = Customer.create({
      id: command.id,
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
      active: existing.active ?? true,
    });
    await this.repository.update(customer);
  }
}
