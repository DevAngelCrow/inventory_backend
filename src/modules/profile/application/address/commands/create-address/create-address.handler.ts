import { AddressRepository } from '@/modules/profile/domain/repositories/address.repository';
import { CreateAddressCommand } from './create-address.command';
import { Address } from '@/modules/profile/domain/entities/address';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

@CommandHandler(CreateAddressCommand)
export class CreateAddressHandler implements ICommandHandler<CreateAddressCommand> {
  constructor(private readonly repository: AddressRepository) {}

  async execute(command: CreateAddressCommand): Promise<Address> {
    const address = Address.create({ ...command.address_dto });
    return await this.repository.create(address);
  }
}
