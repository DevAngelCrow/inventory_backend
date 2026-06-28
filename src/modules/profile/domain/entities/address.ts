import { AddressBlock } from '../value-objects/address-value-object/address-block';
import { AddressCurrent } from '../value-objects/address-value-object/address-current';
import { AddressHouseNumber } from '../value-objects/address-value-object/address-house-number';
import { AddressId } from '../value-objects/address-value-object/address-id';
import { AddressIdGeographicDivision } from '../value-objects/address-value-object/address-id-geographic-division';
import { AddressIdPeople } from '../value-objects/address-value-object/address-id-people';
import { AddressNeighborhood } from '../value-objects/address-value-object/address-neighborhood';
import { AddressPathway } from '../value-objects/address-value-object/address-pathway';
import { AddressStreet } from '../value-objects/address-value-object/address-street';
import { AddressStreetNumber } from '../value-objects/address-value-object/address-street-number';

export class Address {
  constructor(
    private readonly street: AddressStreet,
    private readonly street_number: AddressStreetNumber,
    private readonly neighborhood: AddressNeighborhood,
    private readonly id_geographic_division: AddressIdGeographicDivision,
    private readonly house_number: AddressHouseNumber,
    private readonly block: AddressBlock,
    private readonly pathway: AddressPathway,
    private readonly current: AddressCurrent,
    private readonly id_people: AddressIdPeople,
    private readonly id?: AddressId,
  ) {}
  static create(data: {
    id?: AddressId | null;
    street: AddressStreet;
    street_number: AddressStreetNumber;
    neighborhood: AddressNeighborhood;
    id_geographic_division: AddressIdGeographicDivision;
    house_number: AddressHouseNumber;
    block: AddressBlock;
    pathway: AddressPathway;
    current: AddressCurrent;
    id_people: AddressIdPeople;
  }): Address {
    return new Address(
      data.street,
      data.street_number,
      data.neighborhood,
      data.id_geographic_division,
      data.house_number,
      data.block,
      data.pathway,
      data.current,
      data.id_people,
      data.id ?? undefined,
    );
  }
  getId(): AddressId | undefined {
    return this.id;
  }
  getStreet(): AddressStreet {
    return this.street;
  }
  getStreetNumber(): AddressStreetNumber {
    return this.street_number;
  }
  getNeighborhood(): AddressNeighborhood {
    return this.neighborhood;
  }
  getIdGeographicDivision(): AddressIdGeographicDivision {
    return this.id_geographic_division;
  }
  getHouseNumber(): AddressHouseNumber {
    return this.house_number;
  }
  getBlock(): AddressBlock {
    return this.block;
  }
  getPathway(): AddressPathway {
    return this.pathway;
  }
  getCurrent(): AddressCurrent {
    return this.current;
  }
  getIdPeople(): AddressIdPeople {
    return this.id_people;
  }
}
