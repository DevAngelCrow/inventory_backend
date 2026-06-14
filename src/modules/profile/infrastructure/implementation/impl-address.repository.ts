import { Injectable } from '@nestjs/common';
import { Address } from '../../domain/entities/address';
import { AddressRepository } from '../../domain/repositories/address.repository';
import { AddressId } from '../../domain/value-objects/address-value-object/address-id';
import { PrismaService } from 'src/shared/infrastructure/persistence/prisma/prisma.service';
import { TransactionContextService } from '@/shared/infrastructure/services/transaction-context.service';
import { mnt_address } from 'generated/prisma/client';
import { NotFoundException } from '@/shared/domain/exceptions/not-found.exception';
import { DatabaseException } from '@/shared/infrastructure/exceptions/database.exception';
import { Pagination } from '@/shared/domain/value-object/pagination';
import { PaginationParams } from '@/shared/domain/value-object/pagination-params';
import { EntityList } from '@/shared/domain/value-object/entity-list';
import { TotalItems } from '@/shared/domain/value-object/total-items';
import { TotalPages } from '@/shared/domain/value-object/total-page';
import { AddressReadRepository } from '../../application/repositories/address-read.repository';

@Injectable()
export class ImplAddressRepository
  implements AddressRepository, AddressReadRepository
{
  private addresses: Address[] = [];
  constructor(
    private readonly prisma: PrismaService,
    private readonly transactionContext: TransactionContextService,
  ) {}

  private getPrismaClient() {
    return this.transactionContext.getTransaction() ?? this.prisma;
  }
  async create(address: Address): Promise<Address> {
    try {
      const prisma = this.getPrismaClient();
      const addressDb = await prisma.mnt_address.create({
        data: {
          street: address.getStreet().value(),
          street_number: address.getStreetNumber().value(),
          neighborhood: address.getNeighborhood().value(),
          house_number: address.getHouseNumber().value(),
          block: address.getBlock().value(),
          pathway: address.getPathway().value(),
          current: address.getCurrent().value(),
          id_people: address.getIdPeople().value(),
          active: true,
        },
      });
      const addressCreateEntity = Address.create({
        street: address.getStreet().value(),
        street_number: address.getStreetNumber().value(),
        neighborhood: address.getNeighborhood().value(),
        id_geographic_division: address.getIdGeographicDivision().value(),
        house_number: address.getHouseNumber().value(),
        block: address.getBlock().value(),
        pathway: address.getPathway().value(),
        current: address.getCurrent().value(),
        id_people: address.getIdPeople().value(),
        id: addressDb.id,
      });
      return addressCreateEntity;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Error creating address: ${error.message}`);
      }
      throw new DatabaseException('Error creating address', 'create');
    }
  }
  async update(address: Address): Promise<void> {
    try {
      const prisma = this.getPrismaClient();
      const idAddress = address.getId()?.value();
      if (!idAddress) {
        await prisma.mnt_address.create({
          data: {
            street: address.getStreet().value(),
            street_number: address.getStreetNumber().value(),
            neighborhood: address.getNeighborhood().value(),
            house_number: address.getHouseNumber().value(),
            block: address.getBlock().value(),
            pathway: address.getPathway().value(),
            current: address.getCurrent().value(),
            id_people: address.getIdPeople().value(),
            id_geographic_division: address.getIdGeographicDivision().value(),
          },
        });
      } else {
        await prisma.mnt_address.update({
          where: {
            id: idAddress,
          },
          data: {
            street: address.getStreet().value(),
            street_number: address.getStreetNumber().value(),
            neighborhood: address.getNeighborhood().value(),
            house_number: address.getHouseNumber().value(),
            block: address.getBlock().value(),
            pathway: address.getPathway().value(),
            current: address.getCurrent().value(),
            id_people: address.getIdPeople().value(),
            id_geographic_division: address.getIdGeographicDivision().value(),
          },
        });
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error updating address: ${error.message}`);
      }
      throw new DatabaseException('Error updating address', 'update');
    }
  }
  async getAll(
    pagination_params?: PaginationParams,
    filter?: string,
  ): Promise<Pagination<Address> | Address[]> {
    try {
      const where = {
        street: {
          contains: filter,
          mode: 'insensitive' as const,
        },
      };
      const prisma = this.getPrismaClient();
      const addressesDb = await prisma.mnt_address.findMany({
        skip:
          pagination_params?.getPage().value() &&
          pagination_params?.getPerPage().value()
            ? (pagination_params.getPage().value() - 1) *
              pagination_params.getPerPage().value()
            : undefined,
        take: pagination_params?.getPerPage().value(),
        where,
        orderBy: {
          street: 'asc',
        },
      });
      const total = await prisma.mnt_address.count({ where });

      const addresses =
        addressesDb.length > 0
          ? addressesDb.map((addressDb: mnt_address) =>
              this.mapToDomain(addressDb),
            )
          : [];

      this.addresses = addresses;

      if (!pagination_params) {
        return this.addresses;
      }

      const entityList: EntityList<Address> =
        addresses.length > 0
          ? new EntityList<Address>(this.addresses)
          : new EntityList<Address>([]);

      return new Pagination<Address>(
        entityList,
        pagination_params.getPage(),
        pagination_params.getPerPage(),
        new TotalItems(Number(total)),
        new TotalPages(
          Math.ceil(total / pagination_params.getPerPage().value()),
        ),
      );
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error getting addresses: ${error.message}`);
      }
      throw new DatabaseException('Error getting addresses', 'getAll');
    }
  }
  async getOneById(id: AddressId): Promise<Address | null> {
    try {
      const prisma = this.getPrismaClient();
      const addressDb: mnt_address | null = await prisma.mnt_address.findFirst({
        where: {
          id: id.value(),
        },
      });
      if (!addressDb) {
        return null;
      }
      const address = this.mapToDomain(addressDb);
      return address;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error getting address: ${error.message}`);
      }
      throw new NotFoundException('Address', id.value().toString());
    }
  }
  async delete(id: AddressId): Promise<void> {
    try {
      const prisma = this.getPrismaClient();
      const addressDb = await prisma.mnt_address.update({
        where: {
          id: id.value(),
        },
        data: {
          active: false,
        },
      });
      if (!addressDb) {
        throw new NotFoundException('Address', id.value().toString());
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error deleting address: ${error.message}`);
      }
      throw new DatabaseException('Error deleting address', 'delete');
    }
  }
  private mapToDomain(prismaAddress: mnt_address): Address {
    return Address.create({
      id: prismaAddress.id,
      street: prismaAddress.street,
      street_number: prismaAddress.street_number,
      neighborhood: prismaAddress.neighborhood,
      id_geographic_division: prismaAddress.id_geographic_division ?? null,
      house_number: prismaAddress.house_number,
      block: prismaAddress.block,
      pathway: prismaAddress.pathway,
      current: prismaAddress.current,
      id_people: prismaAddress.id_people,
    });
  }
}
