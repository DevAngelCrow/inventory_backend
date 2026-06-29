import { Injectable } from '@nestjs/common';
import { GlobalStatsusRepository } from '../../../domain/repositories/global-status-repository';
import { GlobalStatus } from '../../../domain/entities/global-status';
import { GlobalStatusId } from '../../../domain/value-objects/goblal-status-value-object/global-status-id';
import { PrismaService } from '@/shared/infrastructure/persistence/prisma/prisma.service';
import { DatabaseException } from '@/shared/infrastructure/exceptions/database.exception';
import { NotFoundException } from '@/shared/domain/exceptions/not-found.exception';
import {
  Prisma,
  ctl_status,
  ctl_category_status,
} from 'generated/prisma/client';
import { Pagination } from '@/shared/domain/value-object/pagination';
import { PaginationParams } from '@/shared/domain/value-object/pagination-params';
import { EntityList } from '@/shared/domain/value-object/entity-list';
import { TotalItems } from '@/shared/domain/value-object/total-items';
import { TotalPages } from '@/shared/domain/value-object/total-page';
import { GlobalStatusQueriesRepository } from '@/modules/catalogs/application/repositories/global-status-read.repository';
import { GlobalStatusDto } from '@/modules/catalogs/application/dtos/global-status.dto';
import { ctl_statusGetPayload } from 'generated/prisma/models';
import { CategoryStatusDto } from '@/modules/catalogs/application/dtos/category-status.dto';
import { GetBooleanStatusCatalogService } from '@/shared/infrastructure/services/get-status-catalog.service';
import { BooleanStatusData } from '@/shared/infrastructure/interfaces/boolean-status-data.interface';
import { StatusMapperUtil } from '@/shared/infrastructure/utils/status-mapper.util';
import { GlobalStatusHttpDto } from '../../dtos/http/global-status-http-dto/global-status-http.dto';
import { TransactionContextService } from '@/shared/infrastructure/services/transaction-context.service';

@Injectable()
export class ImplGlobalStatusRepository
  implements GlobalStatsusRepository, GlobalStatusQueriesRepository
{
  private globalStatuses: GlobalStatusDto[] = [];
  constructor(
    private readonly prisma: PrismaService,
    private readonly transactionContext: TransactionContextService,
  ) {}
  async create(global_status: GlobalStatus): Promise<void> {
    try {
      const prisma = this.getPrismaClient();
      await prisma.ctl_status.create({
        data: {
          name: global_status.getName().value(),
          description: global_status.getDescription().value(),
          code: global_status.getCode().value(),
          active: global_status.getActive().value(),
          state_color: global_status.getStateColor()?.value(),
          text_color: global_status.getTextColor()?.value(),
          id_category_status: global_status.getIdCategoryStatus().value(),
        },
      });
    } catch (error: any) {
      if (error?.code === 'P2002') {
        throw new DatabaseException(
          'El código y la categoría de estado ingresados ya existen. Por favor, intente con otros valores.',
          'create',
        );
      }
      if (error instanceof Error) {
        throw new Error(`Error creating global status: ${error.message}`);
      }
      throw new DatabaseException('Error creating global status', 'create');
    }
  }
  async update(global_status: GlobalStatus): Promise<void> {
    try {
      const prisma = this.getPrismaClient();
      await prisma.ctl_status.update({
        where: {
          id: global_status.getId()?.value(),
        },
        data: {
          name: global_status.getName().value(),
          description: global_status.getDescription().value(),
          code: global_status.getCode().value(),
          active: global_status.getActive().value(),
          state_color: global_status.getStateColor()?.value(),
          text_color: global_status.getTextColor()?.value(),
        },
      });
    } catch (error: any) {
      if (error?.code === 'P2002') {
        throw new DatabaseException(
          'El código y la categoría de estado ingresados ya existen. Por favor, intente con otros valores.',
          'create',
        );
      }
      if (error instanceof Error) {
        throw new Error(`Error updating global status: ${error.message}`);
      }
      throw new DatabaseException('Error updating global status', 'update');
    }
  }
  async getAll(
    pagination_params?: PaginationParams,
    filter?: string,
    active?: boolean,
    id_category?: string,
    code_category?: string,
  ): Promise<Pagination<GlobalStatusDto> | GlobalStatusDto[]> {
    try {
      const prisma = this.getPrismaClient();
      const where = {
        name: {
          contains: filter,
          mode: Prisma.QueryMode.insensitive,
        },
        active: active,
        id_category_status: id_category,
        ctl_category_status: {
          code: code_category,
        },
      };
      const globalStatusesDb = await prisma.ctl_status.findMany({
        skip:
          pagination_params?.getPage().value() &&
          pagination_params?.getPerPage().value()
            ? (pagination_params.getPage().value() - 1) *
              pagination_params.getPerPage().value()
            : undefined,
        take: pagination_params?.getPerPage().value(),
        where,
        orderBy: {
          ctl_category_status: {
            name: 'asc',
          },
        },
        include: { ctl_category_status: true },
      });
      const total = await prisma.ctl_status.count({ where });
      const catalog_status =
        await GetBooleanStatusCatalogService.getStatus(prisma);
      const globalStatuses = globalStatusesDb.map(
        (
          globalStatusDb: ctl_statusGetPayload<{
            include: { ctl_category_status: true };
          }>,
        ) => this.mapReadModelToDto(globalStatusDb, catalog_status),
      );

      this.globalStatuses = globalStatuses;

      if (!pagination_params) {
        return globalStatuses;
      }

      const entityList: EntityList<GlobalStatusDto> =
        globalStatuses.length > 0
          ? new EntityList<GlobalStatusDto>(globalStatuses)
          : new EntityList<GlobalStatusDto>([]);

      return new Pagination<GlobalStatusDto>(
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
        throw new Error(`Error getting global statuses: ${error.message}`);
      }
      throw new DatabaseException('Error getting global statuses', 'getAll');
    }
  }
  async getOneById(id: string): Promise<GlobalStatusDto | null> {
    try {
      const prisma = this.getPrismaClient();
      const globalStatusDb = await prisma.ctl_status.findFirst({
        where: {
          id: id,
        },
        include: { ctl_category_status: true },
      });
      if (!globalStatusDb) {
        return null;
      }
      const globalStatus = this.mapReadModelToDto(globalStatusDb);
      return globalStatus;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error getting global status: ${error.message}`);
      }
      throw new DatabaseException('Error getting global status', 'getOneById');
    }
  }
  async toggleStatus(id: GlobalStatusId): Promise<GlobalStatus> {
    try {
      const globalStatusDb = await this.getOneById(id.value());
      if (!globalStatusDb) {
        throw new NotFoundException('GlobalStatus', id.value().toString());
      }
      const prisma = this.getPrismaClient();
      const globalStatus = await prisma.ctl_status.update({
        where: {
          id: id.value(),
        },
        data: {
          active: !globalStatusDb.active,
        },
      });
      const globalStatusEntity = this.mapToDomain(globalStatus);
      return globalStatusEntity;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error toggling global status: ${error.message}`);
      }
      throw new DatabaseException(
        'Error toggling global status',
        'toggleStatus',
      );
    }
  }
  async getOneByCode(
    code: string,
    category: string,
  ): Promise<GlobalStatusDto | null> {
    try {
      const prisma = this.getPrismaClient();
      const globalStatusDb = await prisma.ctl_status.findFirst({
        where: {
          code: code,
          ctl_category_status: {
            name: category,
          },
        },
        include: { ctl_category_status: true },
      });
      if (!globalStatusDb) {
        return null;
      }
      const globalStatus = this.mapReadModelToDto(globalStatusDb);
      return globalStatus;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(
          `Error getting global status by code: ${error.message}`,
        );
      }
      throw new DatabaseException(
        'Error getting global status by code',
        'getOneByCode',
      );
    }
  }
  private mapToDomain(prismaGlobalStatus: ctl_status): GlobalStatus {
    return GlobalStatus.create({
      id: prismaGlobalStatus.id,
      name: prismaGlobalStatus.name,
      description: prismaGlobalStatus.description,
      code: prismaGlobalStatus.code,
      active: prismaGlobalStatus.active,
      state_color: prismaGlobalStatus.state_color,
      text_color: prismaGlobalStatus.text_color,
      id_category_status: prismaGlobalStatus.id_category_status,
    });
  }
  private mapReadModelToDto(
    global_status: ctl_statusGetPayload<{
      include: { ctl_category_status: true };
    }>,
    catalog_status?: Map<string, BooleanStatusData>,
  ): GlobalStatusDto<CategoryStatusDto> {
    const status = StatusMapperUtil.getStatusFromBoolean(
      global_status.active,
      catalog_status,
      'mapReadModelToDto',
    );
    return new GlobalStatusHttpDto<CategoryStatusDto>(
      global_status.name,
      global_status.description,
      global_status.code,
      global_status.active,
      global_status.state_color,
      global_status.text_color,
      global_status.id_category_status,
      global_status.id,
      new CategoryStatusDto(
        global_status.ctl_category_status.name,
        global_status.ctl_category_status.code,
        global_status.ctl_category_status.description,
        global_status.ctl_category_status.active,
        global_status.ctl_category_status.id,
      ),
      status,
    );
  }
  private getPrismaClient() {
    return this.prisma.client;
  }
}
