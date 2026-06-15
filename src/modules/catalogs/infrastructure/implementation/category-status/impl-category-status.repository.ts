import { Injectable } from '@nestjs/common';
import { CategoryStatus } from '../../../domain/entities/category-status';
import { CategoryStatusRepository } from '../../../domain/repositories/category-status-repository';
import { CategoryStatusId } from '../../../domain/value-objects/category-status-value-object/category-status-id';
import { PrismaService } from 'src/shared/infrastructure/persistence/prisma/prisma.service';
import { NotFoundException } from '@/shared/domain/exceptions/not-found.exception';
import { DatabaseException } from '@/shared/infrastructure/exceptions/database.exception';
import { Pagination } from '@/shared/domain/value-object/pagination';
import { PaginationParams } from '@/shared/domain/value-object/pagination-params';
import { EntityList } from '@/shared/domain/value-object/entity-list';
import { TotalItems } from '@/shared/domain/value-object/total-items';
import { TotalPages } from '@/shared/domain/value-object/total-page';
import { CategoryStatusQueriesRepository } from '@/modules/catalogs/application/repositories/category-status-read.repository';
import { ctl_category_status } from 'generated/prisma/client';
import { CategoryStatusDto } from '@/modules/catalogs/application/dtos/category-status.dto';
import { GetBooleanStatusCatalogService } from '@/shared/infrastructure/services/get-status-catalog.service';
import { BooleanStatusData } from '@/shared/infrastructure/interfaces/boolean-status-data.interface';
import { StatusMapperUtil } from '@/shared/infrastructure/utils/status-mapper.util';
import { CategoryStatusHttpDto } from '../../dtos/http/category-status-http-dto/category-status-http.dto';

@Injectable()
export class ImplCategoryStatusRepository
  implements CategoryStatusRepository, CategoryStatusQueriesRepository
{
  private categoriesStatus: CategoryStatusDto[] = [];
  constructor(private readonly prisma: PrismaService) {}
  async create(categoryStatus: CategoryStatus): Promise<void> {
    try {
      await this.prisma.client.ctl_category_status.create({
        data: {
          name: categoryStatus.getName().value(),
          code: categoryStatus.getCode().value(),
          description: categoryStatus.getDescription().value(),
          active: categoryStatus.getActive().value(),
        },
      });
    } catch (error: any) {
      if (error?.code === 'P2002') {
        throw new DatabaseException(
          'El nombre y el código de la categoría de estado ingresados ya existen. Por favor, intente con otros valores.',
          'create',
        );
      }
      if (error instanceof Error) {
        throw new Error(`Error creating category status: ${error.message}`);
      }
      throw new DatabaseException('Error creating category status', 'create');
    }
  }
  async update(categoryStatus: CategoryStatus): Promise<void> {
    try {
      await this.prisma.client.ctl_category_status.update({
        where: {
          id: categoryStatus.getId()?.value(),
        },
        data: {
          name: categoryStatus.getName().value(),
          code: categoryStatus.getCode().value(),
          description: categoryStatus.getDescription().value(),
          active: categoryStatus.getActive().value(),
        },
      });
    } catch (error: any) {
      if (error?.code === 'P2002') {
        throw new DatabaseException(
          'El nombre y el código de la categoría de estado ingresados ya existen. Por favor, intente con otros valores.',
          'create',
        );
      }
      if (error instanceof Error) {
        throw new Error(`Error updating category status: ${error.message}`);
      }
      throw new DatabaseException('Error updating category status', 'update');
    }
  }
  async getAll(
    pagination_params?: PaginationParams,
    filter?: string,
    active?: boolean,
  ): Promise<Pagination<CategoryStatusDto> | CategoryStatusDto[]> {
    try {
      const where = {
        name: {
          contains: filter,
          mode: 'insensitive' as const,
        },
        active,
      };
      const [categoriesStatusDb, total, catalog_status] = await Promise.all([
        this.prisma.client.ctl_category_status.findMany({
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
        this.prisma.client.ctl_category_status.count({ where }),
        GetBooleanStatusCatalogService.getStatus(this.prisma),
      ]);

      const categoriesStatus =
        categoriesStatusDb.length > 0
          ? categoriesStatusDb.map((categoryStatusDb: ctl_category_status) =>
              this.mapReadModelToDto(categoryStatusDb, catalog_status),
            )
          : [];

      this.categoriesStatus = categoriesStatus;

      if (!pagination_params) {
        return this.categoriesStatus;
      }

      const entityList: EntityList<CategoryStatusDto> =
        categoriesStatus.length > 0
          ? new EntityList<CategoryStatusDto>(this.categoriesStatus)
          : new EntityList<CategoryStatusDto>([]);

      return new Pagination<CategoryStatusDto>(
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
        throw new Error(`Error getting categories status: ${error.message}`);
      }
      throw new DatabaseException('Error getting categories status', 'getAll');
    }
  }
  async getOneById(id: string): Promise<CategoryStatusDto | null> {
    try {
      const categoryStatusDb: ctl_category_status | null =
        await this.prisma.client.ctl_category_status.findFirst({
          where: {
            id: id,
          },
        });
      if (!categoryStatusDb) {
        return null;
      }
      const categoryStatus = this.mapReadModelToDto(categoryStatusDb);
      return categoryStatus;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error getting category status: ${error.message}`);
      }
      throw new NotFoundException('CategoryStatus', id.toString());
    }
  }
  async toggleStatus(id: CategoryStatusId): Promise<CategoryStatus> {
    try {
      const categoryStatus = await this.getOneById(id.value());
      if (!categoryStatus) {
        throw new NotFoundException('CategoryStatus', id.value().toString());
      }
      const categoryStatusDb = await this.prisma.client.ctl_category_status.update({
        where: {
          id: id.value(),
        },
        data: {
          active: !categoryStatus.active,
        },
      });

      const categoryStatusEntity = this.mapToDomain(categoryStatusDb);

      return categoryStatusEntity;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error deleting category status: ${error.message}`);
      }
      throw new DatabaseException('Error deleting category status', 'delete');
    }
  }
  private mapToDomain(
    prismaCategoryStatus: ctl_category_status,
  ): CategoryStatus {
    return CategoryStatus.create({
      id: prismaCategoryStatus.id,
      name: prismaCategoryStatus.name,
      code: prismaCategoryStatus.code,
      description: prismaCategoryStatus.description,
      active: prismaCategoryStatus.active,
    });
  }
  private mapReadModelToDto(
    category_status: ctl_category_status,
    catalog_status?: Map<string, BooleanStatusData>,
  ): CategoryStatusHttpDto {
    const status = StatusMapperUtil.getStatusFromBoolean(
      category_status.active,
      catalog_status,
      'mapReadModelToDto',
    );
    return new CategoryStatusHttpDto(
      category_status.name,
      category_status.code,
      category_status.description,
      category_status.active,
      category_status.id,
      status,
    );
  }
}
