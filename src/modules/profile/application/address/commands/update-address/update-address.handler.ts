import { PersonRepository } from '@/modules/profile/domain/repositories/person.repository';
import { UpdateAddressCommand } from './update-address.command';
import { Address } from '@/modules/profile/domain/entities/address';
import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { NotFoundException } from '@/shared/domain/exceptions/not-found.exception';
import { PersonId } from '@/modules/profile/domain/value-objects/person-value-object/person-id';
import { AddressId } from '@/modules/profile/domain/value-objects/address-value-object/address-id';
import { AddressStreet } from '@/modules/profile/domain/value-objects/address-value-object/address-street';
import { AddressStreetNumber } from '@/modules/profile/domain/value-objects/address-value-object/address-street-number';
import { AddressNeighborhood } from '@/modules/profile/domain/value-objects/address-value-object/address-neighborhood';
import { AddressIdGeographicDivision } from '@/modules/profile/domain/value-objects/address-value-object/address-id-geographic-division';
import { AddressHouseNumber } from '@/modules/profile/domain/value-objects/address-value-object/address-house-number';
import { AddressBlock } from '@/modules/profile/domain/value-objects/address-value-object/address-block';
import { AddressPathway } from '@/modules/profile/domain/value-objects/address-value-object/address-pathway';
import { AddressCurrent } from '@/modules/profile/domain/value-objects/address-value-object/address-current';
import { AddressIdPeople } from '@/modules/profile/domain/value-objects/address-value-object/address-id-people';

@CommandHandler(UpdateAddressCommand)
export class UpdateAddressHandler implements ICommandHandler<UpdateAddressCommand> {
  constructor(
    private readonly repository: PersonRepository,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: UpdateAddressCommand): Promise<void> {
    const personId = new PersonId(command.address_dto.id_people);
    const personEntity = await this.repository.findById(personId);
    
    if (!personEntity) {
      throw new NotFoundException('Person', command.address_dto.id_people);
    }

    const person = this.publisher.mergeObjectContext(personEntity);
    const address = Address.create({
      id: command.address_dto.id ? new AddressId(command.address_dto.id) : null,
      street: new AddressStreet(command.address_dto.street),
      street_number: new AddressStreetNumber(command.address_dto.street_number),
      neighborhood: new AddressNeighborhood(command.address_dto.neighborhood),
      id_geographic_division: new AddressIdGeographicDivision(command.address_dto.id_geographic_division),
      house_number: new AddressHouseNumber(command.address_dto.house_number),
      block: new AddressBlock(command.address_dto.block),
      pathway: new AddressPathway(command.address_dto.pathway),
      current: new AddressCurrent(command.address_dto.current),
      id_people: new AddressIdPeople(command.address_dto.id_people),
    });
    if (!command.address_dto.id) {
      throw new Error('Address ID is required for update');
    }
    person.updateAddress(command.address_dto.id, address);

    await this.repository.update(person);
    person.commit();
  }
}
