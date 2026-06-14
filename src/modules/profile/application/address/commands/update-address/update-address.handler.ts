import { AddressRepository } from '@/modules/profile/domain/repositories/address.repository';
import { UpdateAddressCommand } from './update-address.command';
import { Address } from '@/modules/profile/domain/entities/address';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

@CommandHandler(UpdateAddressCommand)
export class UpdateAddressHandler implements ICommandHandler<UpdateAddressCommand> {
  constructor(private readonly repository: AddressRepository) {}

  async execute(command: UpdateAddressCommand): Promise<void> {
    const address = Address.create({ ...command.address_dto });
    await this.repository.update(address);
  }
}
