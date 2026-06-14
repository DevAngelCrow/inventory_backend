import { Injectable } from '@nestjs/common';
import { GeographicDivisionRepository } from '../../../domain/repositories/geographic-division-repository';
import { GeographicDivision } from '../../../domain/entities/geographic-division';
import { GeographicDivisionId } from '../../../domain/value-objects/geographic-division-value-object/geographic-division-id';
import { PrismaService } from '@/shared/infrastructure/persistence/prisma/prisma.service';
import { DatabaseException } from '@/shared/infrastructure/exceptions/database.exception';
import { NotFoundException } from '@/shared/domain/exceptions/not-found.exception';
import { ctl_geographic_division } from 'generated/prisma/client';
import { Pagination } from '@/shared/domain/value-object/pagination';
import { PaginationParams } from '@/shared/domain/value-object/pagination-params';
import { EntityList } from '@/shared/domain/value-object/entity-list';
import { TotalItems } from '@/shared/domain/value-object/total-items';
import { TotalPages } from '@/shared/domain/value-object/total-page';
import { GeographicDivisionQueriesRepository } from '@/modules/catalogs/application/repositories/geographic-division-read.repository';
import { GeographicDivisionDto } from '@/modules/catalogs/application/dtos/geographic-division.dto';
import { ctl_geographic_divisionGetPayload } from 'generated/prisma/models/ctl_geographic_division';
import { CountryDto } from '@/modules/catalogs/application/dtos/country.dto';
import { GeographicDivisionTypeDto } from '@/modules/catalogs/application/dtos/geographic-division-type.dto';
import { BooleanStatusData } from '@/shared/infrastructure/interfaces/boolean-status-data.interface';
import { GeographicDivisionHttpDto } from '../../dtos/http/geographic-division-http-dto/geographic-division-http.dto';
import { StatusMapperUtil } from '@/shared/infrastructure/utils/status-mapper.util';
import { GetBooleanStatusCatalogService } from '@/shared/infrastructure/services/get-status-catalog.service';

@Injectable()
export class ImplGeographicDivisionRepository
  implements GeographicDivisionRepository, GeographicDivisionQueriesRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async create(division: GeographicDivision): Promise<void> {
    try {
      await this.prisma.ctl_geographic_division.create({
        data: {
          name: division.getName().value(),
          description: division.getDescription().value() ?? null,
          id_country: division.getIdCountry().value(),
          id_type: division.getIdType().value(),
          id_parent: division.getIdParent().value() ?? null,
          active: division.getActive().value(),
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error creating geographic division: ${error.message}`);
      }
      throw new DatabaseException(
        'Error creating geographic division',
        'create',
      );
    }
  }

  async update(division: GeographicDivision): Promise<void> {
    try {
      await this.prisma.ctl_geographic_division.update({
        where: { id: division.getId()?.value() },
        data: {
          name: division.getName().value(),
          description: division.getDescription().value() ?? null,
          id_country: division.getIdCountry().value(),
          id_type: division.getIdType().value(),
          id_parent: division.getIdParent().value() ?? null,
          active: division.getActive().value(),
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error updating geographic division: ${error.message}`);
      }
      throw new DatabaseException(
        'Error updating geographic division',
        'update',
      );
    }
  }

  async getAll(
    pagination_params?: PaginationParams,
    filter?: string,
    active?: boolean,
    id_country?: string,
    id_parent?: string,
    id_type?: string,
  ): Promise<Pagination<GeographicDivisionDto> | GeographicDivisionDto[]> {
    try {
      const where = {
        name: { contains: filter, mode: 'insensitive' as const },
        active,
        id_country,
        id_parent,
        id_type,
      };

      const [items, total, catalog_status] = await Promise.all([
        this.prisma.ctl_geographic_division.findMany({
          skip:
            pagination_params?.getPage().value() &&
            pagination_params?.getPerPage().value()
              ? (pagination_params.getPage().value() - 1) *
                pagination_params.getPerPage().value()
              : undefined,
          take: pagination_params?.getPerPage().value(),
          where,
          orderBy: { name: 'asc' },
          include: {
            ctl_country: true,
            ctl_geographic_division_type: true,
            ctl_geographic_division: true,
          },
        }),
        this.prisma.ctl_geographic_division.count({ where }),
        GetBooleanStatusCatalogService.getStatus(this.prisma),
      ]);

      const dtos = items.map((item) =>
        this.mapReadModelToDto(item, catalog_status),
      );

      if (!pagination_params) return dtos;

      return new Pagination<GeographicDivisionDto>(
        dtos.length > 0
          ? new EntityList<GeographicDivisionDto>(dtos)
          : new EntityList<GeographicDivisionDto>([]),
        pagination_params.getPage(),
        pagination_params.getPerPage(),
        new TotalItems(total),
        new TotalPages(
          Math.ceil(total / pagination_params.getPerPage().value()),
        ),
      );
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error getting geographic divisions: ${error.message}`);
      }
      throw new DatabaseException(
        'Error getting geographic divisions',
        'getAll',
      );
    }
  }

  async getAllWithCursor(
    cursor: string | undefined,
    limit: number,
    filter?: string,
    active?: boolean,
    id_country?: string,
    id_parent?: string,
    id_type?: string,
  ): Promise<{ data: GeographicDivisionDto[]; next_cursor: string | null }> {
    try {
      const decodedCursor = cursor
        ? Buffer.from(cursor, 'base64').toString('utf-8')
        : undefined;

      const where = {
        name: filter
          ? { contains: filter, mode: 'insensitive' as const }
          : undefined,
        active,
        id_country,
        id_parent,
        id_type,
      };

      const [items, catalog_status] = await Promise.all([
        this.prisma.ctl_geographic_division.findMany({
          take: limit + 1,
          skip: decodedCursor ? 1 : 0,
          cursor: decodedCursor ? { id: decodedCursor } : undefined,
          where,
          orderBy: { id: 'asc' },
          include: {
            ctl_country: true,
            ctl_geographic_division_type: true,
            ctl_geographic_division: true,
          },
        }),
        GetBooleanStatusCatalogService.getStatus(this.prisma),
      ]);

      const hasNextPage = items.length > limit;
      if (hasNextPage) items.pop();

      const data = items.map((item) =>
        this.mapReadModelToDto(item, catalog_status),
      );
      const lastItem = items[items.length - 1];
      const next_cursor =
        hasNextPage && lastItem
          ? Buffer.from(lastItem.id, 'utf-8').toString('base64')
          : null;

      return { data, next_cursor };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(
          `Error getting geographic divisions with cursor: ${error.message}`,
        );
      }
      throw new DatabaseException(
        'Error getting geographic divisions with cursor',
        'getAllWithCursor',
      );
    }
  }

  async getOneById(id: string): Promise<GeographicDivisionDto | null> {
    try {
      const [item, catalog_status] = await Promise.all([
        this.prisma.ctl_geographic_division.findFirst({
          where: { id },
          include: {
            ctl_country: true,
            ctl_geographic_division_type: true,
            ctl_geographic_division: true,
          },
        }),
        GetBooleanStatusCatalogService.getStatus(this.prisma),
      ]);
      if (!item) return null;
      return this.mapReadModelToDto(item, catalog_status);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error getting geographic division: ${error.message}`);
      }
      throw new DatabaseException(
        'Error getting geographic division',
        'getOneById',
      );
    }
  }

  async toggleStatus(id: GeographicDivisionId): Promise<GeographicDivision> {
    try {
      const existing = await this.getOneById(id.value());
      if (!existing) {
        throw new NotFoundException('GeographicDivision', id.value());
      }
      const updated = await this.prisma.ctl_geographic_division.update({
        where: { id: id.value() },
        data: { active: !existing.active },
      });
      return this.mapToDomain(updated);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(
          `Error toggling geographic division status: ${error.message}`,
        );
      }
      throw new DatabaseException(
        'Error toggling geographic division status',
        'toggleStatus',
      );
    }
  }

  private mapToDomain(item: ctl_geographic_division): GeographicDivision {
    return GeographicDivision.create({
      id: item.id,
      name: item.name,
      description: item.description ?? undefined,
      id_country: item.id_country,
      id_type: item.id_type,
      id_parent: item.id_parent ?? undefined,
      active: item.active,
    });
  }

  private mapReadModelToDto(
    item: ctl_geographic_divisionGetPayload<{
      include: {
        ctl_country: true;
        ctl_geographic_division_type: true;
        ctl_geographic_division: true;
      };
    }>,
    catalog_status?: Map<string, BooleanStatusData>,
  ): GeographicDivisionDto {
    const status = StatusMapperUtil.getStatusFromBoolean(
      item.active,
      catalog_status,
      'mapReadModelToDto',
    );
    const parent = item.ctl_geographic_division
      ? new GeographicDivisionHttpDto(
          item.ctl_geographic_division.name,
          item.ctl_geographic_division.description ?? undefined,
          item.ctl_geographic_division.id_country,
          item.ctl_geographic_division.id_type,
          item.ctl_geographic_division.active,
          item.ctl_geographic_division.id_parent ?? undefined,
          item.ctl_geographic_division.id,
        )
      : undefined;

    const divisionType = item.ctl_geographic_division_type
      ? new GeographicDivisionTypeDto(
          item.ctl_geographic_division_type.name,
          item.ctl_geographic_division_type.level,
          item.ctl_geographic_division_type.id_country,
          item.ctl_geographic_division_type.active,
          item.ctl_geographic_division_type.id,
        )
      : undefined;

    const country = new CountryDto(
      item.ctl_country.name,
      item.ctl_country.iso2,
      item.ctl_country.abbreviation,
      item.ctl_country.code,
      item.ctl_country.phone_code,
      item.ctl_country.active,
      item.ctl_country.id,
    );

    return new GeographicDivisionHttpDto(
      item.name,
      item.description ?? undefined,
      item.id_country,
      item.id_type,
      item.active,
      item.id_parent ?? undefined,
      item.id,
      parent,
      divisionType,
      country,
      status,
    );
  }
}
