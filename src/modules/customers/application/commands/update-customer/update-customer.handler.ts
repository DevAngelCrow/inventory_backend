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
      middle_name: command.middle_name,
      last_name: command.last_name,
      phone: command.phone,
      email: command.email,
      phone_secondary: command.phone_secondary,
      company_name: command.company_name,
      tax_id: command.tax_id,
      notes: command.notes,
      id_country: command.id_country,
      addresses: existing.addresses ? existing.addresses.map(a => ({
        id: a.id,
        label: a.label,
        address_line1: a.address_line1,
        address_line2: a.address_line2,
        zip_code: a.zip_code,
        is_primary: a.is_primary,
        id_geographic_division: a.id_geographic_division,
        active: a.active,
      })) : [],
      active: existing.active ?? true,
    });
    await this.repository.update(customer);
  }
}
