import { PrismaService } from '@/shared/infrastructure/persistence/prisma/prisma.service';
import { TransactionContextService } from '@/shared/infrastructure/services/transaction-context.service';
import { Person } from '../../domain/entities/person';
import { PersonRepository } from '../../domain/repositories/person.repository';
import { PersonId } from '../../domain/value-objects/person-value-object/person-id';
import { PersonFirstName } from '../../domain/value-objects/person-value-object/person-first-name';
import { PersonBirthdate } from '../../domain/value-objects/person-value-object/person-birthdate';
import { PersonIdGender } from '../../domain/value-objects/person-value-object/person-id-gender';
import { PersonEmail } from '../../domain/value-objects/person-value-object/person-email';
import { PersonIdMaritalStatus } from '../../domain/value-objects/person-value-object/person-id-marital-status';
import { PersonPhone } from '../../domain/value-objects/person-value-object/person-phone';
import { PersonIdStatus } from '../../domain/value-objects/person-value-object/person-id-status';
import { PersonMiddleName } from '../../domain/value-objects/person-value-object/person-middle-name';
import { PersonLastName } from '../../domain/value-objects/person-value-object/person-last-name';
import { PersonImgPath } from '../../domain/value-objects/person-value-object/person-img-path';
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
import { Document } from '../../domain/entities/document';
import { DocumentId } from '../../domain/value-objects/document-value-object/document-id';
import { DocumentNumberDoc } from '../../domain/value-objects/document-value-object/document-number-doc';
import { DocumentDescription } from '../../domain/value-objects/document-value-object/document-description';
import { DocumentIdPerson } from '../../domain/value-objects/document-value-object/document-id-people';
import { DocumentIdTypeDocument } from '../../domain/value-objects/document-value-object/document-id-type-document';
import { DocumentActive } from '../../domain/value-objects/document-value-object/document-active';
import { Injectable } from '@nestjs/common';
import { DatabaseException } from '@/shared/infrastructure/exceptions/database.exception';
import { ConflictException } from '@/shared/domain/exceptions/conflict-exception';
import { mnt_people, mnt_address, mnt_document } from 'generated/prisma/browser';
import { Pagination } from '@/shared/domain/value-object/pagination';
import { PaginationParams } from '@/shared/domain/value-object/pagination-params';
import { EntityList } from '@/shared/domain/value-object/entity-list';
import { TotalItems } from '@/shared/domain/value-object/total-items';
import { TotalPages } from '@/shared/domain/value-object/total-page';
import {
  mnt_peopleGetPayload,
  mnt_peopleWhereInput,
} from 'generated/prisma/models';
import { PersonReadRepository } from '../../application/repositories/person-read.repository';
import { Prisma } from 'generated/prisma/client';
import { AuthenticateProfileDto } from '@/modules/auth/application/dtos/authenticate-profile.dto';

type PersonWithRelations = mnt_people & {
  mnt_address?: mnt_address[];
  mnt_document?: mnt_document[];
};

@Injectable()
export class ImplPersonRepository
  implements PersonRepository, PersonReadRepository
{
  private persons: Person[] = [];
  constructor(
    private readonly prisma: PrismaService,
    private readonly transactionContext: TransactionContextService,
  ) {}
  private getPrismaClient() {
    return this.prisma.client;
  }
  async getAll(
    pagination_params?: PaginationParams,
    filter?: string,
  ): Promise<Pagination<Person> | Person[]> {
    try {
      const where: mnt_peopleWhereInput | undefined = filter
        ? {
            OR: [
              {
                first_name: {
                  contains: filter,
                  mode: 'insensitive',
                },
              },
              {
                last_name: {
                  contains: filter,
                  mode: 'insensitive',
                },
              },
              {
                middle_name: {
                  contains: filter,
                  mode: 'insensitive',
                },
              },
            ],
          }
        : undefined;
      const prisma = this.getPrismaClient();
      const peopleDb = await prisma.mnt_people.findMany({
        skip:
          pagination_params?.getPage().value() &&
          pagination_params?.getPerPage().value()
            ? (pagination_params.getPage().value() - 1) *
              pagination_params.getPerPage().value()
            : undefined,
        take: pagination_params?.getPerPage().value(),
        where,
        include: {
          people_country: {
            orderBy: {
              id: 'asc',
            },
            include: {
              ctl_country: true,
            },
          },
          mnt_address: true,
          mnt_document: true,
        },
        orderBy: {
          last_name: 'asc',
        },
      });
      const total = await prisma.mnt_people.count({ where });

      const persons = peopleDb.map((personDb) => this.mapToDomain(personDb));
      this.persons = persons;
      if (!pagination_params) {
        return this.persons;
      }
      const entityList: EntityList<Person> =
        persons.length > 0
          ? new EntityList<Person>(this.persons)
          : new EntityList<Person>([]);
      return new Pagination<Person>(
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
        throw new Error(`Error getting persons: ${error.message}`);
      }
      throw new DatabaseException('Error getting persons', 'getAll');
    }
  }

  async create(
    person: Person,
    nationalities: string[] = [],
  ): Promise<Person | void> {
    try {
      const prisma = this.getPrismaClient();
      const personDb = await prisma.mnt_people.create({
        data: {
          first_name: person.getFirstName()?.value() ?? null,
          last_name: person.getLastName()?.value() ?? null,
          email: person.getEmail().value(),
          phone: person.getPhone()?.value() ?? null,
          birthdate: person.getBirthdate()?.value() ?? null,
          id_gender: person.getIdGender()?.value() ?? null,
          id_marital_status: person.getIdMaritalStatus()?.value() ?? null,
          id_status: person.getIdStatus().value(),
          middle_name: person.getMiddleName()?.value() ?? null,
          img_path: person.getImgPath()?.value() ?? null,
          people_country: {
            createMany: {
              data: nationalities.map((nation: string) => ({
                id_country: nation,
              })),
            },
          },
        },
      });
      return this.mapToDomain(personDb);
    } catch (error: unknown) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          'Account registration failed. Please verify your information and try again.',
        );
      }
      if (error instanceof Error) {
        throw new Error(`Error creating person: ${error.message}`);
      }
      throw new DatabaseException('Error creating person', 'create');
    }
  }

  async update(person: Person, nationalities: string[] = []): Promise<void> {
    try {
      const prisma = this.getPrismaClient();
      await prisma.$transaction(async (tx) => {
        const id_person = person.getId()?.value();
        if (!id_person) throw new Error('Person ID is required for update');

        await tx.mnt_people.update({
          where: { id: id_person },
          data: {
            first_name: person.getFirstName()?.value(),
            last_name: person.getLastName()?.value(),
            email: person.getEmail().value(),
            phone: person.getPhone()?.value(),
            birthdate: person.getBirthdate()?.value(),
            id_gender: person.getIdGender()?.value(),
            id_marital_status: person.getIdMaritalStatus()?.value(),
            id_status: person.getIdStatus()?.value(),
            middle_name: person.getMiddleName()?.value() ?? '',
            img_path: person.getImgPath()?.value() ?? undefined,
            people_country: {
              deleteMany: {},
              createMany: {
                data: nationalities.map((nation: string) => ({
                  id_country: nation,
                })),
              },
            },
          },
        });

        // Sync Addresses
        const currentAddressIds = person.getAddresses().map(a => a.getId()?.value()).filter(Boolean) as string[];
        await tx.mnt_address.deleteMany({
          where: {
            id_people: id_person,
            id: { notIn: currentAddressIds }
          }
        });

        for (const addr of person.getAddresses()) {
          const addrId = addr.getId()?.value();
          const data = {
            street: addr.getStreet().value(),
            street_number: addr.getStreetNumber().value(),
            neighborhood: addr.getNeighborhood().value(),
            house_number: addr.getHouseNumber().value(),
            block: addr.getBlock().value(),
            pathway: addr.getPathway().value(),
            current: addr.getCurrent().value(),
            id_geographic_division: addr.getIdGeographicDivision()?.value(),
            id_people: id_person,
          };
          if (addrId) {
            await tx.mnt_address.update({ where: { id: addrId }, data });
          } else {
            await tx.mnt_address.create({ data });
          }
        }

        // Sync Documents
        const currentDocIds = person.getDocuments().map(d => d.getId()?.value()).filter(Boolean) as string[];
        await tx.mnt_document.deleteMany({
          where: {
            id_people: id_person,
            id: { notIn: currentDocIds }
          }
        });

        for (const doc of person.getDocuments()) {
          const docId = doc.getId()?.value();
          const data = {
            document_number: doc.getNumberDocument().value(),
            id_document_type: doc.getIdTypeDocument().value(),
            active: doc.getActive().value(),
            description: doc.getDescription()?.value(),
            id_people: id_person,
          };
          if (docId) {
            await tx.mnt_document.update({ where: { id: docId }, data });
          } else {
            await tx.mnt_document.create({ data });
          }
        }
      });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error updating person: ${error.message}`);
      }
      throw new DatabaseException('Error updating person', 'update');
    }
  }

  async findById(id: PersonId): Promise<Person | null> {
    try {
      const prisma = this.getPrismaClient();
      const personDb = await prisma.mnt_people.findFirst({
        where: { id: id.value() },
        include: { mnt_address: true, mnt_document: true },
      });
      if (!personDb) return null;
      return this.mapToDomain(personDb);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error finding person by ID: ${error.message}`);
      }
      throw new DatabaseException('Error finding person by ID', 'findById');
    }
  }

  async getOneByEmail(email: PersonEmail): Promise<Person | null> {
    try {
      const prisma = this.getPrismaClient();
      const personDb = await prisma.mnt_people.findFirst({
        where: { email: email.value() },
        include: { mnt_address: true, mnt_document: true },
      });
      if (!personDb) return null;
      return this.mapToDomain(personDb);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error getting person by Email: ${error.message}`);
      }
      throw new DatabaseException('Error getting person by Email', 'getOneByEmail');
    }
  }

  async getOneByIdProfile(id_user: string): Promise<AuthenticateProfileDto | null> {
    try {
      const prisma = this.getPrismaClient();
      const personDb: any = await prisma.mnt_people.findFirst({
        where: { mnt_user: { id: id_user } },
        include: {
          people_country: { include: { ctl_country: true } },
          ctl_gender: true,
          ctl_marital_status: true,
          ctl_status: true,
          mnt_address: {
            where: { current: true },
            include: {
              ctl_geographic_division: {
                include: {
                  ctl_country: true,
                  ctl_geographic_division_type: true,
                },
              },
            },
          },
          mnt_document: {
            include: {
              ctl_document_type: true,
            },
          },
          mnt_user: true,
        },
      });
      if (!personDb) return null;
      return this.mapToReadModel(personDb);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error getting profile by ID: ${error.message}`);
      }
      throw new DatabaseException('Error getting profile by ID', 'getOneByIdProfile');
    }
  }

  delete(id: PersonId): Promise<void> {
    console.log(id);
    throw new Error('Method not implemented.');
  }

  private mapToDomain(prismaPerson: PersonWithRelations): Person {
    const person = Person.create({
      first_name: prismaPerson.first_name ? new PersonFirstName(prismaPerson.first_name) : null,
      birthdate: prismaPerson.birthdate ? new PersonBirthdate(prismaPerson.birthdate) : null,
      id_gender: prismaPerson.id_gender ? new PersonIdGender(prismaPerson.id_gender) : null,
      email: new PersonEmail(prismaPerson.email),
      id_marital_status: prismaPerson.id_marital_status ? new PersonIdMaritalStatus(prismaPerson.id_marital_status) : null,
      phone: prismaPerson.phone ? new PersonPhone(prismaPerson.phone) : null,
      id_status: new PersonIdStatus(prismaPerson.id_status),
      middle_name: prismaPerson.middle_name ? new PersonMiddleName(prismaPerson.middle_name) : null,
      last_name: prismaPerson.last_name ? new PersonLastName(prismaPerson.last_name) : null,
      img_path: prismaPerson.img_path ? new PersonImgPath(prismaPerson.img_path) : null,
      id: new PersonId(prismaPerson.id),
    });

    if (prismaPerson.mnt_address) {
      const addresses = prismaPerson.mnt_address.map(a => Address.create({
        id: a.id ? new AddressId(a.id) : null,
        street: new AddressStreet(a.street),
        street_number: new AddressStreetNumber(a.street_number),
        neighborhood: new AddressNeighborhood(a.neighborhood),
        id_geographic_division: new AddressIdGeographicDivision(a.id_geographic_division),
        house_number: new AddressHouseNumber(a.house_number),
        block: new AddressBlock(a.block),
        pathway: new AddressPathway(a.pathway),
        current: new AddressCurrent(a.current),
        id_people: new AddressIdPeople(a.id_people),
      }));
      person.setAddresses(addresses);
    }

    if (prismaPerson.mnt_document) {
      const documents = prismaPerson.mnt_document.map(d => Document.create({
        id: d.id ? new DocumentId(d.id) : null,
        number_document: new DocumentNumberDoc(d.document_number),
        description: d.description ? new DocumentDescription(d.description) : undefined,
        id_people: new DocumentIdPerson(d.id_people),
        id_type_document: new DocumentIdTypeDocument(d.id_document_type),
        active: new DocumentActive(d.active),
      }));
      person.setDocuments(documents);
    }

    return person;
  }

  private mapToReadModel(prismaPerson: any): AuthenticateProfileDto {
    const currentAddress = prismaPerson?.mnt_address?.find(
      (address: any) => address.current === true,
    );
    const countryAddress = currentAddress?.ctl_geographic_division?.ctl_country;
    const geographicDivisionTypeIdAddress =
      currentAddress?.ctl_geographic_division?.ctl_geographic_division_type;
    const geographicDivisionIdAddress = currentAddress?.ctl_geographic_division;
    const nationalities =
      prismaPerson?.people_country?.map((pc: any) => ({
        id: pc.ctl_country.id,
        name: pc.ctl_country.name,
        abbreviation: pc.ctl_country.abbreviation,
        code: pc.ctl_country.code,
        active: pc.ctl_country.active,
        iso2: pc.ctl_country.iso2,
        phone_code: pc.ctl_country.phone_code,
      })) ?? [];
    const documentType = prismaPerson?.mnt_document?.[0]?.ctl_document_type;
    const document = {
      document_number: prismaPerson?.mnt_document?.[0]?.document_number,
      description: prismaPerson?.mnt_document?.[0]?.description,
      active: prismaPerson?.mnt_document?.[0]?.active,
      id: prismaPerson?.mnt_document?.[0]?.id,
    };
    return new AuthenticateProfileDto(
      prismaPerson?.email ?? null,
      prismaPerson?.mnt_user?.user_name ?? null,
      prismaPerson?.first_name ?? null,
      prismaPerson?.middle_name ?? null,
      prismaPerson?.last_name ?? null,
      prismaPerson?.ctl_marital_status?.id ?? null,
      prismaPerson?.birthdate ?? null,
      nationalities,
      prismaPerson?.ctl_gender?.id ?? null,
      prismaPerson?.phone ?? null,
      prismaPerson?.ctl_status?.id ?? null,
      documentType ?? null,
      document,
      countryAddress ?? null,
      geographicDivisionTypeIdAddress ?? null,
      geographicDivisionIdAddress ?? null,
      currentAddress?.street ?? null,
      currentAddress?.street_number ?? null,
      currentAddress?.house_number ?? null,
      currentAddress?.neighborhood ?? null,
      currentAddress?.block ?? null,
      currentAddress?.pathway ?? null,
      currentAddress?.current ?? null,
      currentAddress?.id ?? null,
      prismaPerson?.mnt_user?.id ?? null,
      prismaPerson?.id ?? null,
      prismaPerson?.img_path ?? null,
    );
  }
}
