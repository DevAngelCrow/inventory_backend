import { Injectable } from '@nestjs/common';
import { GeographicDivisionTypeRepository } from '../../../domain/repositories/geographic-division-type-repository';
import { GeographicDivisionType } from '../../../domain/entities/geographic-division-type';
import { GeographicDivisionTypeId } from '../../../domain/value-objects/geographic-division-type-value-object/geographic-division-type-id';
import { PrismaService } from '@/shared/infrastructure/persistence/prisma/prisma.service';
import { DatabaseException } from '@/shared/infrastructure/exceptions/database.exception';
import { NotFoundException } from '@/shared/domain/exceptions/not-found.exception';
import { ctl_geographic_division_type } from 'generated/prisma/client';
import { Pagination } from '@/shared/domain/value-object/pagination';
import { PaginationParams } from '@/shared/domain/value-object/pagination-params';
import { EntityList } from '@/shared/domain/value-object/entity-list';
import { TotalItems } from '@/shared/domain/value-object/total-items';
import { TotalPages } from '@/shared/domain/value-object/total-page';
import { GeographicDivisionTypeQueriesRepository } from '@/modules/catalogs/application/repositories/geographic-division-type-read.repository';
import { GeographicDivisionTypeDto } from '@/modules/catalogs/application/dtos/geographic-division-type.dto';
import { ctl_geographic_division_typeGetPayload } from 'generated/prisma/models/ctl_geographic_division_type';
import { CountryDto } from '@/modules/catalogs/application/dtos/country.dto';
import { BooleanStatusData } from '@/shared/infrastructure/interfaces/boolean-status-data.interface';
import { GeographicDivisionTypeHttpDto } from '../../dtos/http/geographic-division-type-http-dto/geographic-division-type-http.dto';
import { StatusMapperUtil } from '@/shared/infrastructure/utils/status-mapper.util';
import { GetBooleanStatusCatalogService } from '@/shared/infrastructure/services/get-status-catalog.service';

@Injectable()
export class ImplGeographicDivisionTypeRepository
  implements
    GeographicDivisionTypeRepository,
    GeographicDivisionTypeQueriesRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async create(divisionType: GeographicDivisionType): Promise<void> {
    try {
      await this.prisma.client.ctl_geographic_division_type.create({
        data: {
          name: divisionType.getName().value(),
          level: divisionType.getLevel().value(),
          id_country: divisionType.getIdCountry().value(),
          active: divisionType.getActive().value(),
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(
          `Error creating geographic division type: ${error.message}`,
        );
      }
      throw new DatabaseException(
        'Error creating geographic division type',
        'create',
      );
    }
  }

  async update(divisionType: GeographicDivisionType): Promise<void> {
    try {
      await this.prisma.client.ctl_geographic_division_type.update({
        where: { id: divisionType.getId()?.value() },
        data: {
          name: divisionType.getName().value(),
          level: divisionType.getLevel().value(),
          id_country: divisionType.getIdCountry().value(),
          active: divisionType.getActive().value(),
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(
          `Error updating geographic division type: ${error.message}`,
        );
      }
      throw new DatabaseException(
        'Error updating geographic division type',
        'update',
      );
    }
  }

  async getAll(
    pagination_params?: PaginationParams,
    filter?: string,
    active?: boolean,
    id_country?: string,
  ): Promise<
    Pagination<GeographicDivisionTypeDto> | GeographicDivisionTypeDto[]
  > {
    try {
      const where = {
        name: { contains: filter, mode: 'insensitive' as const },
        active,
        id_country,
      };

      const [items, total, catalog_status] = await Promise.all([
        this.prisma.client.ctl_geographic_division_type.findMany({
          skip:
            pagination_params?.getPage().value() &&
            pagination_params?.getPerPage().value()
              ? (pagination_params.getPage().value() - 1) *
                pagination_params.getPerPage().value()
              : undefined,
          take: pagination_params?.getPerPage().value(),
          where,
          orderBy: [{ level: 'asc' }, { name: 'asc' }],
          include: { ctl_country: true },
        }),
        this.prisma.client.ctl_geographic_division_type.count({ where }),
        GetBooleanStatusCatalogService.getStatus(this.prisma),
      ]);

      const dtos = items.map((item) =>
        this.mapReadModelToDto(item, catalog_status),
      );

      if (!pagination_params) return dtos;

      return new Pagination<GeographicDivisionTypeDto>(
        dtos.length > 0
          ? new EntityList<GeographicDivisionTypeDto>(dtos)
          : new EntityList<GeographicDivisionTypeDto>([]),
        pagination_params.getPage(),
        pagination_params.getPerPage(),
        new TotalItems(total),
        new TotalPages(
          Math.ceil(total / pagination_params.getPerPage().value()),
        ),
      );
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(
          `Error getting geographic division types: ${error.message}`,
        );
      }
      throw new DatabaseException(
        'Error getting geographic division types',
        'getAll',
      );
    }
  }

  async getOneById(id: string): Promise<GeographicDivisionTypeDto | null> {
    try {
      const [item, catalog_status] = await Promise.all([
        this.prisma.client.ctl_geographic_division_type.findFirst({
          where: { id },
          include: { ctl_country: true },
        }),
        GetBooleanStatusCatalogService.getStatus(this.prisma),
      ]);
      if (!item) return null;
      return this.mapReadModelToDto(item, catalog_status);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(
          `Error getting geographic division type: ${error.message}`,
        );
      }
      throw new DatabaseException(
        'Error getting geographic division type',
        'getOneById',
      );
    }
  }

  async toggleStatus(
    id: GeographicDivisionTypeId,
  ): Promise<GeographicDivisionType> {
    try {
      const existing = await this.getOneById(id.value());
      if (!existing) {
        throw new NotFoundException('GeographicDivisionType', id.value());
      }
      const updated = await this.prisma.client.ctl_geographic_division_type.update({
        where: { id: id.value() },
        data: { active: !existing.active },
      });
      return this.mapToDomain(updated);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(
          `Error toggling geographic division type status: ${error.message}`,
        );
      }
      throw new DatabaseException(
        'Error toggling geographic division type status',
        'toggleStatus',
      );
    }
  }

  private mapToDomain(
    item: ctl_geographic_division_type,
  ): GeographicDivisionType {
    return GeographicDivisionType.create({
      id: item.id,
      name: item.name,
      level: item.level,
      id_country: item.id_country,
      active: item.active,
    });
  }

  private mapReadModelToDto(
    item: ctl_geographic_division_typeGetPayload<{
      include: { ctl_country: true };
    }>,
    catalog_status?: Map<string, BooleanStatusData>,
  ): GeographicDivisionTypeDto<CountryDto> {
    const status = StatusMapperUtil.getStatusFromBoolean(
      item.active,
      catalog_status,
      'mapReadModelToDto',
    );
    return new GeographicDivisionTypeHttpDto<CountryDto>(
      item.name,
      item.level,
      item.id_country,
      item.active,
      item.id,
      new CountryDto(
        item.ctl_country.name,
        item.ctl_country.iso2,
        item.ctl_country.abbreviation,
        item.ctl_country.code,
        item.ctl_country.phone_code,
        item.ctl_country.active,
        item.ctl_country.id,
      ),
      status,
    );
  }
}
