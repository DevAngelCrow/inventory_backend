import { AddressDto } from '../../../dtos/address.dto';

export class UpdateAddressCommand {
  constructor(public readonly address_dto: AddressDto) {}
}
