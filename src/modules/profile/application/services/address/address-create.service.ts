import { Address } from '@/modules/profile/domain/entities/address';
import { AddressDto } from '../../dtos/address.dto';
import { CreateAddressHandler } from '../../address/commands/create-address/create-address.handler';
import { CreateAddressCommand } from '../../address/commands/create-address/create-address.command';
export class AddressCreateService {
  constructor(private readonly addressCreateService: CreateAddressHandler) {}
  async run(address_dto: AddressDto): Promise<void> {
    const addressCommand = new CreateAddressCommand(address_dto);
    await this.addressCreateService.execute(addressCommand);
  }
}
