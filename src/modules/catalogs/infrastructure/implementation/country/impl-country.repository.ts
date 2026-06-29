import { Injectable } from '@nestjs/common';
import { Country } from '../../../domain/entities/country';
import { CountryRepository } from '../../../domain/repositories/country-repository';
import { CountryId } from '../../../domain/value-objects/country-value-object/country-id';
import { PrismaService } from 'src/shared/infrastructure/persistence/prisma/prisma.service';
import { Prisma, ctl_country } from 'generated/prisma/client';
import { NotFoundException } from '@/shared/domain/exceptions/not-found.exception';
import { DatabaseException } from '@/shared/infrastructure/exceptions/database.exception';
import { Pagination } from '@/shared/domain/value-object/pagination';
import { PaginationParams } from '@/shared/domain/value-object/pagination-params';
import { EntityList } from '@/shared/domain/value-object/entity-list';
import { TotalItems } from '@/shared/domain/value-object/total-items';
import { TotalPages } from '@/shared/domain/value-object/total-page';
import { CountryQueriesRepository } from '@/modules/catalogs/application/repositories/country-read.repository';
import { CountryDto } from '@/modules/catalogs/application/dtos/country.dto';
import { BooleanStatusData } from '@/shared/infrastructure/interfaces/boolean-status-data.interface';
import { StatusMapperUtil } from '@/shared/infrastructure/utils/status-mapper.util';
import { CountryHttpDto } from '../../dtos/http/country-http-dto/country-http.dto';
import { GetBooleanStatusCatalogService } from '@/shared/infrastructure/services/get-status-catalog.service';

@Injectable()
export class ImplCountryRepository
  implements CountryRepository, CountryQueriesRepository
{
  private countries: CountryDto[] = [];
  constructor(private readonly prisma: PrismaService) {}
  async create(country: Country): Promise<void> {
    try {
      await this.prisma.client.ctl_country.create({
        data: {
          name: country.getName().value(),
          iso2: country.getIso2().value(),
          code: country.getCode().value(),
          phone_code: country.getPhoneCode().value(),
          abbreviation: country.getAbbreviation().value(),
          active: country.getActive().value(),
        },
      });
      //return countryCreated;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Error creating country: ${error.message}`);
      }
      throw new DatabaseException('Error creating country', 'create');
    }
  }
  async update(country: Country): Promise<void> {
    try {
      await this.prisma.client.ctl_country.update({
        where: {
          id: country.getId()?.value(),
        },
        data: {
          name: country.getName().value(),
          code: country.getCode().value(),
          abbreviation: country.getAbbreviation().value(),
          active: country.getActive().value(),
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error creating country: ${error.message}`);
      }
      throw new DatabaseException('Error updating country', 'update');
    }
  }
  async getAll(
    pagination_params?: PaginationParams,
    filter?: string,
    active?: boolean,
  ): Promise<Pagination<CountryDto> | CountryDto[]> {
    try {
      const where = {
        name: {
          contains: filter,
          mode: Prisma.QueryMode.insensitive,
        },
        active: active,
      };
      const [countriesDb, total, catalog_status] = await Promise.all([
        this.prisma.client.ctl_country.findMany({
          skip:
            pagination_params?.getPage().value() &&
            pagination_params?.getPerPage().value()
              ? (pagination_params.getPage().value() - 1) *
                pagination_params.getPerPage().value()
              : undefined,
          take: pagination_params?.getPerPage().value(),
          where,
          orderBy: {
            name: 'asc',
          },
        }),
        this.prisma.client.ctl_country.count({ where }),
        GetBooleanStatusCatalogService.getStatus(this.prisma),
      ]);

      const countries =
        countriesDb.length > 0
          ? countriesDb.map((countryDb: ctl_country) =>
              this.mapReadModelToDto(countryDb, catalog_status),
            )
          : [];

      this.countries = countries;

      if (!pagination_params) {
        return this.countries;
      }

      const entityList: EntityList<CountryDto> =
        countries.length > 0
          ? new EntityList<CountryDto>(this.countries)
          : new EntityList<CountryDto>([]);

      return new Pagination<CountryDto>(
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
        throw new Error(`Error getting countries: ${error.message}`);
      }
      throw new DatabaseException('Error getting countries', 'getAll');
    }
  }
  async getOneById(id: string): Promise<CountryDto | null> {
    try {
      const countryDb: ctl_country | null =
        await this.prisma.client.ctl_country.findFirst({
          where: {
            id: id,
          },
        });
      if (!countryDb) {
        return null;
      }
      const country = this.mapReadModelToDto(countryDb);
      return country;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error creating country: ${error.message}`);
      }
      throw new NotFoundException('Country', id.toString());
    }
  }
  async toggleStatus(id: CountryId): Promise<Country> {
    try {
      const countryDb = await this.getOneById(id.value());

      if (!countryDb) {
        throw new NotFoundException('Country', id.value().toString());
      }
      const country = await this.prisma.client.ctl_country.update({
        where: {
          id: id.value(),
        },
        data: {
          active: !countryDb.active,
        },
      });
      const countryEntity = this.mapToDomain(country);

      return countryEntity;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error creating country: ${error.message}`);
      }
      throw new DatabaseException('Error deleting country', 'delete');
    }
  }
  private mapToDomain(prismaCountry: ctl_country): Country {
    return Country.create({
      id: prismaCountry.id,
      name: prismaCountry.name,
      iso2: prismaCountry.iso2,
      code: prismaCountry.code,
      phone_code: prismaCountry.phone_code,
      abbreviation: prismaCountry.abbreviation,
      active: prismaCountry.active,
    });
  }
  private mapReadModelToDto(
    country: ctl_country,
    catalog_status?: Map<string, BooleanStatusData>,
  ): CountryHttpDto {
    const status = StatusMapperUtil.getStatusFromBoolean(
      country.active,
      catalog_status,
      'mapReadModelToDto',
    );

    return new CountryHttpDto(
      country.name,
      country.iso2,
      country.abbreviation,
      country.code,
      country.phone_code,
      country.active,
      country.id,
      status,
    );
  }
}
