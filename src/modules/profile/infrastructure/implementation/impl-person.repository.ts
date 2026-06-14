import { PrismaService } from '@/shared/infrastructure/persistence/prisma/prisma.service';
import { TransactionContextService } from '@/shared/infrastructure/services/transaction-context.service';
import { Person } from '../../domain/entities/person';
import { PersonRepository } from '../../domain/repositories/person.repository';
import { PersonEmail } from '../../domain/value-objects/person-value-object/person-email';
import { PersonId } from '../../domain/value-objects/person-value-object/person-id';
import { Injectable } from '@nestjs/common';
import { DatabaseException } from '@/shared/infrastructure/exceptions/database.exception';
import { ConflictException } from '@/shared/domain/exceptions/conflict-exception';
import { mnt_people } from 'generated/prisma/browser';
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
    return this.transactionContext.getTransaction() ?? this.prisma;
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
        },
        orderBy: {
          last_name: 'asc',
        },
      });
      const total = await prisma.mnt_people.count({ where });

      const persons = peopleDb.map((personDb: mnt_people) =>
        this.mapToDomain(personDb),
      );
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
    nationalities: string[],
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
      const personCreatedEntity = this.mapToDomain(personDb);
      return personCreatedEntity;
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
  async update(person: Person, nationalities: string[]): Promise<void> {
    try {
      const prisma = this.getPrismaClient();
      await prisma.mnt_people.update({
        where: {
          id: person.getId()?.value(),
        },
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
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error creating country: ${error.message}`);
      }
      throw new DatabaseException('Error creating country', 'update');
    }
  }

  async getOneById(id: PersonId): Promise<Person | null> {
    try {
      const prisma = this.getPrismaClient();
      const personDb = await prisma.mnt_people.findFirst({
        where: {
          id: id.value(),
        },
      });
      if (!personDb) {
        return null;
      }
      const person = this.mapToDomain(personDb);
      return person;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error getting person by ID: ${error.message}`);
      }
      throw new DatabaseException('Error getting person by ID', 'getOneById');
    }
  }
  async getOneByEmail(email: PersonEmail): Promise<Person | null> {
    try {
      const prisma = this.getPrismaClient();
      const personDb = await prisma.mnt_people.findFirst({
        where: {
          email: email.value(),
        },
      });
      if (!personDb) {
        return null;
      }
      const person = this.mapToDomain(personDb);
      return person;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error getting person by Email: ${error.message}`);
      }
      throw new DatabaseException(
        'Error getting person by Email',
        'getOneByEmail',
      );
    }
  }
  async getOneByIdProfile(
    id_user: string,
  ): Promise<AuthenticateProfileDto | null> {
    try {
      const prisma = this.getPrismaClient();
      const personDb: mnt_peopleGetPayload<{
        include: {
          people_country: {
            include: {
              ctl_country: {
                omit: {
                  updated_at: true;
                  created_at: true;
                };
              };
            };
          };
          ctl_gender: true;
          ctl_marital_status: true;
          ctl_status: true;
          mnt_address: {
            where: {
              current: true;
            };
            include: {
              ctl_geographic_division: {
                include: {
                  ctl_country: true;
                  ctl_geographic_division_type: true;
                };
              };
            };
          };
          mnt_document: {
            include: {
              ctl_document_type: {
                omit: {
                  created_at: true;
                  updated_at: true;
                  deleted_at: true;
                };
              };
            };
          };
          mnt_user: true;
        };
      }> | null = await prisma.mnt_people.findFirst({
        where: {
          mnt_user: {
            id: id_user,
          },
        },
        include: {
          people_country: {
            include: {
              ctl_country: true,
            },
          },
          ctl_gender: true,
          ctl_marital_status: true,
          ctl_status: true,
          mnt_address: {
            where: {
              current: true,
            },
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
              ctl_document_type: {
                omit: {
                  created_at: true,
                  updated_at: true,
                  deleted_at: true,
                },
              },
            },
          },
          mnt_user: true,
        },
      });
      if (!personDb) {
        return null;
      }
      const person = this.mapToReadModel(personDb);
      return person;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error getting person by ID: ${error.message}`);
      }
      throw new DatabaseException('Error getting person by ID', 'getOneById');
    }
  }
  delete(id: PersonId): Promise<void> {
    console.log(id);
    throw new Error('Method not implemented.');
  }
  private mapToDomain(prismaPerson: mnt_people): Person {
    return Person.create({
      first_name: prismaPerson.first_name,
      birthdate: prismaPerson.birthdate,
      id_gender: prismaPerson.id_gender,
      email: prismaPerson.email,
      id_marital_status: prismaPerson.id_marital_status,
      phone: prismaPerson.phone,
      id_status: prismaPerson.id_status,
      middle_name: prismaPerson.middle_name,
      last_name: prismaPerson.last_name,
      img_path: prismaPerson.img_path,
      id: prismaPerson.id,
    });
  }
  private mapToReadModel(
    prismaPerson: mnt_peopleGetPayload<{
      include: {
        people_country: {
          include: {
            ctl_country: {
              omit: {
                updated_at: true;
                created_at: true;
              };
            };
          };
        };
        ctl_gender: true;
        ctl_marital_status: true;
        ctl_status: true;
        mnt_address: {
          where: {
            current: true;
          };
          include: {
            ctl_geographic_division: {
              include: {
                ctl_country: true;
                ctl_geographic_division_type: true;
              };
            };
          };
        };
        mnt_document: {
          include: {
            ctl_document_type: {
              omit: {
                created_at: true;
                updated_at: true;
                deleted_at: true;
              };
            };
          };
        };
        mnt_user: true;
      };
    }> | null,
  ): AuthenticateProfileDto {
    const currentAddress = prismaPerson?.mnt_address.find(
      (address) => address.current === true,
    );
    const countryAddress = currentAddress?.ctl_geographic_division?.ctl_country;
    const geographicDivisionTypeIdAddress =
      currentAddress?.ctl_geographic_division?.ctl_geographic_division_type;
    const geographicDivisionIdAddress = currentAddress?.ctl_geographic_division;
    const nationalities =
      prismaPerson?.people_country.map((pc) => ({
        id: pc.ctl_country.id,
        name: pc.ctl_country.name,
        abbreviation: pc.ctl_country.abbreviation,
        code: pc.ctl_country.code,
        active: pc.ctl_country.active,
        iso2: pc.ctl_country.iso2,
        phone_code: pc.ctl_country.phone_code,
      })) ?? [];
    const documentType = prismaPerson?.mnt_document[0]?.ctl_document_type;
    const document = {
      document_number: prismaPerson?.mnt_document[0]?.document_number,
      description: prismaPerson?.mnt_document[0]?.description,
      active: prismaPerson?.mnt_document[0]?.active,
      id: prismaPerson?.mnt_document[0]?.id,
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
