import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/shared/infrastructure/persistence/prisma/prisma.service';
import { AddressReadRepository } from '../../application/repositories/address-read.repository';
import { PaginationParams } from '@/shared/domain/value-object/pagination-params';
import { Pagination } from '@/shared/domain/value-object/pagination';
import { Address } from '../../domain/entities/address';
import { AddressId } from '../../domain/value-objects/address-value-object/address-id';
import { AddressStreet } from '../../domain/value-objects/address-value-object/address-street';
import { AddressStreetNumber } from '../../domain/value-objects/address-value-object/address-street-number';
import { AddressNeighborhood } from '../../domain/value-objects/address-value-object/address-neighborhood';
import { AddressIdGeographicDivision } from '../../domain/value-objects/address-value-object/address-id-geographic-division';
import { AddressHouseNumber } from '../../domain/value-objects/address-value-object/address-house-number';
import { AddressBlock } from '../../domain/value-objects/address-value-object/address-block';
import { AddressPathway } from '../../domain/value-objects/address-value-object/address-pathway';
import { AddressCurrent } from '../../domain/value-objects/address-value-object/address-current';
import { AddressIdPeople } from '../../domain/value-objects/address-value-object/address-id-people';

@Injectable()
export class ImplAddressReadRepository implements AddressReadRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getAll(
    pagination_params?: PaginationParams,
    filter?: string,
  ): Promise<Pagination<Address> | Address[]> {
    const addressDb = await this.prisma.client.mnt_address.findMany();
    return addressDb.map((a) =>
      Address.create({
        id: a.id ? new AddressId(a.id) : null,
        street: new AddressStreet(a.street),
        street_number: new AddressStreetNumber(a.street_number),
        neighborhood: new AddressNeighborhood(a.neighborhood),
        id_geographic_division: new AddressIdGeographicDivision(
          a.id_geographic_division,
        ),
        house_number: new AddressHouseNumber(a.house_number),
        block: new AddressBlock(a.block),
        pathway: new AddressPathway(a.pathway),
        current: new AddressCurrent(a.current),
        id_people: new AddressIdPeople(a.id_people),
      }),
    );
  }

  async getOneById(id: AddressId): Promise<Address | null> {
    const a = await this.prisma.client.mnt_address.findUnique({
      where: { id: id.value() },
    });
    if (!a) return null;
    return Address.create({
      id: a.id ? new AddressId(a.id) : null,
      street: new AddressStreet(a.street),
      street_number: new AddressStreetNumber(a.street_number),
      neighborhood: new AddressNeighborhood(a.neighborhood),
      id_geographic_division: new AddressIdGeographicDivision(
        a.id_geographic_division,
      ),
      house_number: new AddressHouseNumber(a.house_number),
      block: new AddressBlock(a.block),
      pathway: new AddressPathway(a.pathway),
      current: new AddressCurrent(a.current),
      id_people: new AddressIdPeople(a.id_people),
    });
  }
}
