import { AddressDto } from '../../../dtos/address.dto';

export class CreateAddressCommand {
  constructor(public readonly address_dto: AddressDto) {}
}
