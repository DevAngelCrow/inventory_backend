import { Injectable } from '@nestjs/common';
import { MaritalStatusRepository } from '../../../domain/repositories/marital-status-repository';
import { MaritalStatus } from '../../../domain/entities/marital-status';
import { MaritalStatusId } from '../../../domain/value-objects/marital-status-value-object/marital-status-id';
import { PrismaService } from '@/shared/infrastructure/persistence/prisma/prisma.service';
import { DatabaseException } from '@/shared/infrastructure/exceptions/database.exception';
import { NotFoundException } from '@/shared/domain/exceptions/not-found.exception';
import { ctl_marital_status } from 'generated/prisma/client';
import { Pagination } from '@/shared/domain/value-object/pagination';
import { PaginationParams } from '@/shared/domain/value-object/pagination-params';
import { EntityList } from '@/shared/domain/value-object/entity-list';
import { TotalItems } from '@/shared/domain/value-object/total-items';
import { TotalPages } from '@/shared/domain/value-object/total-page';
import { MaritalStatusQueriesRepository } from '@/modules/catalogs/application/repositories/marital-status-read.repository';
import { MaritalStatusDto } from '@/modules/catalogs/application/dtos/marital-status.dto';
import { MaritalStatusHttpDto } from '../../dtos/http/marital-status-http-dto/marital-status-http.dto';

@Injectable()
export class ImplMaritalStatusRepository
  implements MaritalStatusRepository, MaritalStatusQueriesRepository
{
  private maritalStatuses: MaritalStatusDto[] = [];
  constructor(private readonly prisma: PrismaService) {}
  async create(marital_status: MaritalStatus): Promise<void> {
    try {
      await this.prisma.client.ctl_marital_status.create({
        data: {
          name: marital_status.getName().value(),
          description: marital_status.getDescription()?.value() || '',
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error creating marital status: ${error.message}`);
      }
      throw new DatabaseException('Error creating marital status', 'create');
    }
  }
  async update(marital_status: MaritalStatus): Promise<void> {
    try {
      await this.prisma.client.ctl_marital_status.update({
        where: {
          id: marital_status.getId()?.value(),
        },
        data: {
          name: marital_status.getName().value(),
          description: marital_status.getDescription()?.value() || '',
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error updating marital status: ${error.message}`);
      }
      throw new DatabaseException('Error updating marital status', 'update');
    }
  }
  async getAll(
    pagination_params?: PaginationParams,
    filter?: string,
  ): Promise<Pagination<MaritalStatusDto> | MaritalStatusDto[]> {
    try {
      const where = {
        name: {
          contains: filter,
          mode: 'insensitive' as const,
        },
      };
      const [maritalStatusesDb, total] = await Promise.all([
        this.prisma.client.ctl_marital_status.findMany({
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
        this.prisma.client.ctl_marital_status.count({ where }),
      ]);

      const maritalStatuses = maritalStatusesDb.map((maritalStatusDb) =>
        this.mapReadModelToDto(maritalStatusDb),
      );

      this.maritalStatuses = maritalStatuses;

      if (!pagination_params) {
        return maritalStatuses;
      }

      const entityList: EntityList<MaritalStatusDto> =
        maritalStatuses.length > 0
          ? new EntityList<MaritalStatusDto>(maritalStatuses)
          : new EntityList<MaritalStatusDto>([]);

      return new Pagination<MaritalStatusDto>(
        entityList,
        pagination_params.getPage(),
        pagination_params.getPerPage(),
        new TotalItems(total),
        new TotalPages(
          Math.ceil(total / pagination_params.getPerPage().value()),
        ),
      );
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error getting marital statuses: ${error.message}`);
      }
      throw new DatabaseException('Error getting marital statuses', 'getAll');
    }
  }
  async getOneById(id: string): Promise<MaritalStatusDto | null> {
    try {
      const maritalStatusDb = await this.prisma.client.ctl_marital_status.findFirst({
        where: {
          id: id,
        },
      });
      if (!maritalStatusDb) {
        return null;
      }
      const maritalStatus = this.mapReadModelToDto(maritalStatusDb);
      return maritalStatus;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error getting marital status: ${error.message}`);
      }
      throw new DatabaseException('Error getting marital status', 'getOneById');
    }
  }
  async delete(id: MaritalStatusId): Promise<void> {
    try {
      const maritalStatusDb = await this.getOneById(id.value());
      if (!maritalStatusDb) {
        throw new NotFoundException('MaritalStatus', id.value().toString());
      }
      await this.prisma.client.ctl_marital_status.delete({
        where: {
          id: id.value(),
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error deleting marital status: ${error.message}`);
      }
      throw new DatabaseException('Error deleting marital status', 'delete');
    }
  }
  private mapToDomain(prismaMaritalStatus: ctl_marital_status): MaritalStatus {
    return MaritalStatus.create({
      id: prismaMaritalStatus.id,
      name: prismaMaritalStatus.name,
      description: prismaMaritalStatus.description,
    });
  }
  private mapReadModelToDto(
    marital_status: ctl_marital_status,
  ): MaritalStatusDto {
    return new MaritalStatusHttpDto(
      marital_status.name,
      marital_status.description,
      marital_status.id,
    );
  }
}
