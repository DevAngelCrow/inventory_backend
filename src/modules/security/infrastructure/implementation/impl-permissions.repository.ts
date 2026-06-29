import { PrismaService } from '@/shared/infrastructure/persistence/prisma/prisma.service';
import { PermissionsRepository } from '../../domain/repositories/permissions-repository';
import { TransactionContextService } from '@/shared/infrastructure/services/transaction-context.service';
import { Pagination } from '@/shared/domain/value-object/pagination';
import { PaginationParams } from '@/shared/domain/value-object/pagination-params';
import { Permissions } from '../../domain/entities/permissions';
import { PermissionsId } from '../../domain/value-objects/permissions-value-object/permissions-id';
import { DatabaseException } from '@/shared/infrastructure/exceptions/database.exception';
import { EntityList } from '@/shared/domain/value-object/entity-list';
import { TotalItems } from '@/shared/domain/value-object/total-items';
import { TotalPages } from '@/shared/domain/value-object/total-page';
import { Prisma, ctl_permissions } from 'generated/prisma/client';
import { NotFoundException } from '@/shared/domain/exceptions/not-found.exception';
import { Injectable } from '@nestjs/common';
import { PermissionsReadRepository } from '../../application/repositories/permissions-read.repository';
import { PermissionsDto } from '../../application/dtos/permissions.dto';
import { ctl_permissionsGetPayload } from 'generated/prisma/models';
import { CategoryPermissionsDto } from '../../application/dtos/category-permissions.dto';
import { PermissionsHttpDto } from '../dtos/http/permissions-http-dto/permissions-http.dto';
import { BooleanStatusData } from '@/shared/infrastructure/interfaces/boolean-status-data.interface';
import { StatusMapperUtil } from '@/shared/infrastructure/utils/status-mapper.util';
import { GetBooleanStatusCatalogService } from '@/shared/infrastructure/services/get-status-catalog.service';

@Injectable()
export class ImplPermissionsRepository
  implements PermissionsRepository, PermissionsReadRepository
{
  private permissions: PermissionsDto[] = [];
  constructor(
    private readonly prisma: PrismaService,
    private readonly transactionContext: TransactionContextService,
  ) {}
  private getPrismaClient() {
    return this.prisma.client;
  }
  async create(permission: Permissions): Promise<void> {
    try {
      const prisma = this.getPrismaClient();
      await prisma.ctl_permissions.create({
        data: {
          name: permission.getName().value(),
          description: permission.getDescription().value(),
          active: permission.getActive().value(),
          id_category_permissions: permission
            .getIdCategoryPermissions()
            .value(),
          created_at: new Date(),
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
  async update(permission: Permissions): Promise<void> {
    try {
      const prisma = this.getPrismaClient();
      await prisma.ctl_permissions.update({
        where: {
          id: permission.getId()?.value(),
        },
        data: {
          name: permission.getName().value(),
          description: permission.getDescription().value(),
          active: permission.getActive().value(),
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
    category_permission_id?: string,
  ): Promise<Pagination<PermissionsDto> | PermissionsDto[]> {
    try {
      const where = {
        name: {
          contains: filter,
          mode: Prisma.QueryMode.insensitive,
        },
        active,
        id_category_permissions: category_permission_id,
      };
      const [permissionsDb, total, catalogs_status] = await Promise.all([
        this.prisma.client.ctl_permissions.findMany({
          skip:
            pagination_params?.getPage().value() &&
            pagination_params?.getPerPage().value()
              ? (pagination_params.getPage().value() - 1) *
                pagination_params.getPerPage().value()
              : undefined,
          take: pagination_params?.getPerPage().value(),
          where,
          orderBy: {
            ctl_category_permissions: {
              name: 'asc',
            },
          },
          include: {
            ctl_category_permissions: true,
          },
        }),
        this.prisma.client.ctl_permissions.count({ where }),
        GetBooleanStatusCatalogService.getStatus(this.prisma),
      ]);

      const permissions =
        permissionsDb.length > 0
          ? permissionsDb.map(
              (
                permissionsDb: ctl_permissionsGetPayload<{
                  include: {
                    ctl_category_permissions: true;
                  };
                }>,
              ) => this.mapReadModelToDto(permissionsDb, catalogs_status),
            )
          : [];

      this.permissions = permissions;
      if (!pagination_params) {
        return this.permissions;
      }

      const entityList: EntityList<PermissionsDto> =
        permissions.length > 0
          ? new EntityList<PermissionsDto>(this.permissions)
          : new EntityList<PermissionsDto>([]);

      return new Pagination<PermissionsDto>(
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
        throw new Error(`Error getting permissions: ${error.message}`);
      }
      throw new DatabaseException('Error getting permissions', 'getAll');
    }
  }
  async getOneById(id: string): Promise<PermissionsDto | null> {
    try {
      const prisma = this.getPrismaClient();
      const permissionsDb: ctl_permissionsGetPayload<{
        include: { ctl_category_permissions: true };
      }> | null = await prisma.ctl_permissions.findFirst({
        where: {
          id: id,
        },
        include: {
          ctl_category_permissions: true,
        },
      });
      if (!permissionsDb) {
        return null;
      }
      const permissions = this.mapReadModelToDto(permissionsDb);
      return permissions;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error getting permissions: ${error.message}`);
      }
      throw new DatabaseException('Error getting permissions', 'getOneById');
    }
  }
  async toggleStatus(id: PermissionsId): Promise<Permissions> {
    try {
      const permissionsDb = await this.getOneById(id.value());
      if (!permissionsDb) {
        throw new NotFoundException('Permissions', id.value().toString());
      }
      const prisma = this.getPrismaClient();
      const permissions = await prisma.ctl_permissions.update({
        where: {
          id: id.value(),
        },
        data: {
          active: !permissionsDb.active,
        },
      });
      const permissionsEntity = this.mapToDomain(permissions);
      return permissionsEntity;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error updating category permission: ${error.message}`);
      }
      throw new DatabaseException(
        'Error updating category permission',
        'update',
      );
    }
  }
  private mapToDomain(prismaPermissions: ctl_permissions): Permissions {
    return Permissions.create({
      id: prismaPermissions.id,
      name: prismaPermissions.name,
      description: prismaPermissions.description,
      active: prismaPermissions.active,
      id_category_permissions: prismaPermissions.id_category_permissions,
    });
  }
  private mapReadModelToDto(
    permissions: ctl_permissionsGetPayload<{
      include: { ctl_category_permissions: true };
    }>,
    catalog_status?: Map<string, BooleanStatusData>,
  ): PermissionsHttpDto<CategoryPermissionsDto> {
    const status = StatusMapperUtil.getStatusFromBoolean(
      permissions.active,
      catalog_status,
      'MapReadModelToDto',
    );
    return new PermissionsHttpDto<CategoryPermissionsDto>(
      permissions.name,
      permissions.id_category_permissions,
      permissions.description,
      permissions.active,
      permissions.id,
      new CategoryPermissionsDto(
        permissions.ctl_category_permissions.name,
        permissions.ctl_category_permissions.description,
        permissions.ctl_category_permissions.active,
        permissions.ctl_category_permissions.id,
      ),
      status,
    );
  }
}
