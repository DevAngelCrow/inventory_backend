import { Pagination } from '@/shared/domain/value-object/pagination';
import { PaginationParams } from '@/shared/domain/value-object/pagination-params';
import { CategoryPermissions } from '../../domain/entities/category-permissions';
import { CategoryPermissionsRepository } from '../../domain/repositories/category-permissions-repository';
import { CategoryPermissionsId } from '../../domain/value-objects/category-permissions-value-object/category-permissions-id';
import { PrismaService } from '@/shared/infrastructure/persistence/prisma/prisma.service';
import { TransactionContextService } from '@/shared/infrastructure/services/transaction-context.service';
import { DatabaseException } from '@/shared/infrastructure/exceptions/database.exception';
import { Injectable } from '@nestjs/common';
import { ctl_category_permissions } from 'generated/prisma/client';
import { EntityList } from '@/shared/domain/value-object/entity-list';
import { TotalItems } from '@/shared/domain/value-object/total-items';
import { TotalPages } from '@/shared/domain/value-object/total-page';
import { NotFoundException } from '@/shared/domain/exceptions/not-found.exception';
import { CategoryPermissionsReadRepository } from '../../application/repositories/category-permissions-read.repository';
import { CategoryPermissionsDto } from '../../application/dtos/category-permissions.dto';
import { BooleanStatusData } from '@/shared/infrastructure/interfaces/boolean-status-data.interface';
import { CategoryPermissionsHttpDto } from '../dtos/http/category-permissions-http-dto/category-permissions-http.dto';
import { StatusMapperUtil } from '@/shared/infrastructure/utils/status-mapper.util';
import { GetBooleanStatusCatalogService } from '@/shared/infrastructure/services/get-status-catalog.service';

@Injectable()
export class ImplCategoryPermissionsRepository
  implements CategoryPermissionsRepository, CategoryPermissionsReadRepository
{
  private categoryPermissions: CategoryPermissionsDto[] = [];
  constructor(
    private readonly prisma: PrismaService,
    private readonly transactionContext: TransactionContextService,
  ) {}
  private getPrismaClient() {
    return this.prisma.client;
  }
  async create(category_permissions: CategoryPermissions): Promise<void> {
    try {
      const prisma = this.getPrismaClient();
      await prisma.ctl_category_permissions.create({
        data: {
          name: category_permissions.getName().value(),
          description: category_permissions.getDescription().value(),
          active: category_permissions.getActive().value(),
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(
          `Error creating category permissions: ${error.message}`,
        );
      }
      throw new DatabaseException(
        'Error creating category permissions',
        'create',
      );
    }
  }
  async update(category_permissions: CategoryPermissions): Promise<void> {
    try {
      const prisma = this.getPrismaClient();
      await prisma.ctl_category_permissions.update({
        where: {
          id: category_permissions.getId()?.value(),
        },
        data: {
          name: category_permissions.getName().value(),
          description: category_permissions.getDescription().value(),
          active: category_permissions.getActive().value(),
          updated_at: new Date(),
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(
          `Error updating category permissions: ${error.message}`,
        );
      }
      throw new DatabaseException(
        'Error updating category permissions',
        'update',
      );
    }
  }
  async getAll(
    pagination_params?: PaginationParams,
    filter?: string,
    active?: boolean,
  ): Promise<Pagination<CategoryPermissionsDto> | CategoryPermissionsDto[]> {
    try {
      const where = {
        name: {
          contains: filter,
          mode: 'insensitive' as const,
        },
        active: active,
      };
      const categoryPermissionsDb =
        await this.prisma.client.ctl_category_permissions.findMany({
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
        });
      const total = await this.prisma.client.ctl_category_permissions.count({
        where,
      });
      const catalog_status = await GetBooleanStatusCatalogService.getStatus(
        this.prisma,
      );
      const categoryPermissions =
        categoryPermissionsDb.length > 0
          ? categoryPermissionsDb.map(
              (categoryPermissionsDb: ctl_category_permissions) =>
                this.mapReadModelToDto(categoryPermissionsDb, catalog_status),
            )
          : [];

      this.categoryPermissions = categoryPermissions;

      if (!pagination_params) {
        return this.categoryPermissions;
      }

      const entityList: EntityList<CategoryPermissionsDto> =
        categoryPermissions.length > 0
          ? new EntityList<CategoryPermissionsDto>(this.categoryPermissions)
          : new EntityList<CategoryPermissionsDto>([]);

      return new Pagination<CategoryPermissionsDto>(
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
  async getOneById(id: string): Promise<CategoryPermissionsDto | null> {
    try {
      const categoryPermissionDb: ctl_category_permissions | null =
        await this.prisma.client.ctl_category_permissions.findFirst({
          where: {
            id: id,
          },
        });
      if (!categoryPermissionDb) {
        return null;
      }
      const categoryPermission = this.mapReadModelToDto(categoryPermissionDb);
      return categoryPermission;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error creating category permission: ${error.message}`);
      }
      throw new NotFoundException('CategoryPermission', id.toString());
    }
  }
  async toggleStatus(id: CategoryPermissionsId): Promise<CategoryPermissions> {
    try {
      const categoryPermissionDb = await this.getOneById(id.value());
      if (!categoryPermissionDb) {
        throw new NotFoundException(
          'CategoryPermission',
          id.value().toString(),
        );
      }
      const categoryPermission =
        await this.prisma.client.ctl_category_permissions.update({
          where: {
            id: id.value(),
          },
          data: {
            active: !categoryPermissionDb.active,
          },
        });

      const categoryPermissionEntity = this.mapToDomain(categoryPermission);
      return categoryPermissionEntity;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error creating category permission: ${error.message}`);
      }
      throw new DatabaseException(
        'Error deleting category permission',
        'delete',
      );
    }
  }
  private mapToDomain(
    prismaCategoryPermissions: ctl_category_permissions,
  ): CategoryPermissions {
    return CategoryPermissions.create({
      id: prismaCategoryPermissions.id,
      name: prismaCategoryPermissions.name,
      description: prismaCategoryPermissions.description,
      active: prismaCategoryPermissions.active,
    });
  }
  private mapReadModelToDto(
    category_permissions: ctl_category_permissions,
    catalog_status?: Map<string, BooleanStatusData>,
  ): CategoryPermissionsHttpDto {
    const status = StatusMapperUtil.getStatusFromBoolean(
      category_permissions.active,
      catalog_status,
      'mapReadModelToDto',
    );
    return new CategoryPermissionsHttpDto(
      category_permissions.name,
      category_permissions.description,
      category_permissions.active,
      category_permissions.id,
      status,
    );
  }
}
