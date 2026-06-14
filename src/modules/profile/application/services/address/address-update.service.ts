import { AddressDto } from '../../dtos/address.dto';
import { UpdateAddressHandler } from '../../address/commands/update-address/update-address.handler';
import { UpdateAddressCommand } from '../../address/commands/update-address/update-address.command';
export class AddressUpdateService {
  constructor(private readonly addressUpdateService: UpdateAddressHandler) {}
  async run(address_dto: AddressDto): Promise<void> {
    const addressCommand = new UpdateAddressCommand(address_dto);
    return await this.addressUpdateService.execute(addressCommand);
  }
}
