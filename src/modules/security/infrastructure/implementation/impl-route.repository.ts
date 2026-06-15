import { PrismaService } from '@/shared/infrastructure/persistence/prisma/prisma.service';
import { Route } from '../../domain/entities/route';
import { RouteRepository } from '../../domain/repositories/route-repository';
import { TransactionContextService } from '@/shared/infrastructure/services/transaction-context.service';
import { Pagination } from '@/shared/domain/value-object/pagination';
import { PaginationParams } from '@/shared/domain/value-object/pagination-params';
import { RoutesId } from '../../domain/value-objects/routes-value-object/routes-id';
import { DatabaseException } from '@/shared/infrastructure/exceptions/database.exception';
import { mnt_route } from 'generated/prisma/client';
import { NotFoundException } from '@/shared/domain/exceptions/not-found.exception';
import { EntityList } from '@/shared/domain/value-object/entity-list';
import { TotalItems } from '@/shared/domain/value-object/total-items';
import { TotalPages } from '@/shared/domain/value-object/total-page';
import { Injectable } from '@nestjs/common';
import { RouteReadRepository } from '../../application/repositories/route-read.repository';
import { RouteDto } from '../../application/dtos/route.dto';
import { PermissionsDto } from '../../application/dtos/permissions.dto';
import { mnt_routeGetPayload } from 'generated/prisma/models';
import { BooleanStatusData } from '@/shared/infrastructure/interfaces/boolean-status-data.interface';
import { StatusMapperUtil } from '@/shared/infrastructure/utils/status-mapper.util';
import { RouteHttpDto } from '../dtos/http/route-http-dto/route-http.dto';
import { GetBooleanStatusCatalogService } from '@/shared/infrastructure/services/get-status-catalog.service';

@Injectable()
export class ImplRouteRepository
  implements RouteRepository, RouteReadRepository
{
  private routes: RouteDto[] = [];
  constructor(
    private readonly prisma: PrismaService,
    private readonly transactionContext: TransactionContextService,
  ) {}
  private getPrismaClient() {
    return this.prisma.client;
  }
  async create(route: Route): Promise<Route> {
    try {
      const prisma = this.getPrismaClient();
      const idPermissions: string[] | [] = route.getPermissionsId() ?? [];
      const routeDb = await prisma.mnt_route.create({
        data: {
          name: route.getName().value(),
          description: route.getDescription().value(),
          active: route.getActive().value(),
          icon: route.getIcon().value(),
          uri: route.getUri().value(),
          show: route.getShow().value(),
          order: route.getOrder().value(),
          required_auth: route.getRequiredAuth()?.value(),
          title: route?.getTitle()?.value() ?? '',
          id_parent: route.getIdParent()?.value() || undefined,
          created_at: new Date(),
          mnt_route_permissions: {
            create: idPermissions.map((id_permission: string) => ({
              id_permission,
              created_at: new Date(),
            })),
          },
        },
      });
      const routeEntity = Route.create({
        name: routeDb.name,
        description: routeDb.description ?? '',
        active: routeDb.active,
        icon: routeDb.icon,
        uri: routeDb.uri,
        show: routeDb.show,
        order: Number(routeDb.order),
        required_auth: routeDb.required_auth,
        title: routeDb.title,
        id_parent: routeDb.id_parent || undefined,
        id: routeDb.id,
      });
      return routeEntity;
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
  async update(route: Route): Promise<void> {
    try {
      const prisma = this.getPrismaClient();
      const newPermissions: string[] = route.getPermissionsId() ?? [];
      const routeId = route.getId()?.value();
      const currentPermissions = await prisma.mnt_route_permissions.findMany({
        where: { id_route: routeId },
        select: { id_permission: true },
      });
      const currentPermissionIds = currentPermissions.map(
        (p) => p.id_permission,
      );

      const toDelete = currentPermissionIds.filter(
        (id: string) => !newPermissions.includes(id),
      );
      const toCreate = newPermissions.filter(
        (id: string) => !currentPermissionIds.includes(id),
      );
      await prisma.mnt_route.update({
        where: {
          id: route.getId()?.value(),
        },
        data: {
          name: route.getName().value(),
          description: route.getDescription().value(),
          active: route.getActive().value(),
          icon: route.getIcon().value(),
          uri: route.getUri().value(),
          show: route.getShow().value(),
          order: route.getOrder().value(),
          required_auth: route.getRequiredAuth().value(),
          title: route.getTitle()?.value(),
          id_parent: route.getIdParent()?.value() ?? null,
          updated_at: new Date(),
          mnt_route_permissions: {
            deleteMany:
              toDelete.length > 0
                ? {
                    id_route: routeId,
                    id_permission: {
                      in: toDelete,
                    },
                  }
                : undefined,
            create: toCreate.map((id_permission: string) => ({
              id_permission,
              created_at: new Date(),
            })),
          },
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
    id_parent?: string,
  ): Promise<Pagination<RouteDto> | RouteDto[]> {
    try {
      const prisma = this.getPrismaClient();
      const where = {
        name: {
          contains: filter,
          mode: 'insensitive' as const,
        },
        active: active,
        id_parent: id_parent,
      };
      const routeDb = await prisma.mnt_route.findMany({
        skip:
          pagination_params?.getPage().value() &&
          pagination_params?.getPerPage().value()
            ? (pagination_params.getPage().value() - 1) *
              pagination_params.getPerPage().value()
            : undefined,
        take: pagination_params?.getPerPage().value(),
        where,
        orderBy: {
          id_parent: 'asc',
        },
        include: {
          mnt_route_permissions: {
            include: {
              ctl_permissions: true,
            },
          },
          parent: true,
        },
      });
      const total = await prisma.mnt_route.count({ where });
      const catalog_status = await GetBooleanStatusCatalogService.getStatus(
        this.prisma,
      );
      const routes =
        routeDb.length > 0
          ? routeDb.map((routeDb) =>
              this.mapReadModelToDto<PermissionsDto>(routeDb, catalog_status),
            )
          : [];
      this.routes = routes;
      if (!pagination_params) {
        return this.routes;
      }

      const entityList: EntityList<RouteDto> =
        routes.length > 0
          ? new EntityList<RouteDto>(this.routes)
          : new EntityList<RouteDto>([]);

      return new Pagination<RouteDto>(
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
        throw new Error(`Error getAll: ${error.message}`);
      }
      throw new DatabaseException('Error getAll routes', 'getAll');
    }
  }
  async toggleStatus(id: RoutesId): Promise<Route> {
    try {
      const prisma = this.getPrismaClient();
      const routeDb = await prisma.mnt_route.findUnique({
        where: {
          id: id.value(),
        },
      });
      if (!routeDb) {
        throw new NotFoundException('Route', id.value().toString());
      }
      const route = await prisma.mnt_route.update({
        where: {
          id: id.value(),
        },
        data: {
          active: !routeDb.active,
        },
      });
      const routeEntity = this.mapToDomain(route);
      return routeEntity;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error creating category permission: ${error.message}`);
      }
      throw new DatabaseException('Error deleting route', 'delete');
    }
  }
  async getById(id: string): Promise<RouteDto | null> {
    try {
      const prisma = this.getPrismaClient();
      const routeDb = await prisma.mnt_route.findFirst({
        where: {
          id,
        },
        include: {
          mnt_route_permissions: {
            include: {
              ctl_permissions: true,
            },
          },
          parent: true,
        },
      });
      if (!routeDb) {
        return null;
      }
      const route = this.mapReadModelToDto<PermissionsDto>(routeDb);
      return route;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error creating category permission: ${error.message}`);
      }
      throw new NotFoundException('CategoryPermission', id.toString());
    }
  }
  private mapToDomain(primsaRoute: mnt_route): Route {
    return Route.create({
      id: primsaRoute.id,
      name: primsaRoute.name,
      description: primsaRoute.description ?? '',
      icon: primsaRoute.icon,
      uri: primsaRoute.uri,
      active: primsaRoute.active,
      show: primsaRoute.show,
      order: primsaRoute.order ?? 1,
      required_auth: primsaRoute.required_auth,
      title: primsaRoute.title,
      id_parent: primsaRoute.id_parent || undefined,
    });
  }
  private mapReadModelToDto<T>(
    route: mnt_routeGetPayload<{
      include: {
        mnt_route_permissions: {
          include: {
            ctl_permissions: true;
          };
        };
        parent: true;
      };
    }>,
    catalog_status?: Map<string, BooleanStatusData>,
  ): RouteDto<T> {
    const status = StatusMapperUtil.getStatusFromBoolean(
      route.active,
      catalog_status,
      'MapReadModelToDto',
    );
    return new RouteHttpDto<T>(
      route.name,
      route.description ?? '',
      route.icon,
      route.uri,
      route.active,
      route.show,
      Number(route.order),
      route.required_auth,
      route.id,
      route.title,
      route.mnt_route_permissions?.map((permission) => ({
        id: permission.ctl_permissions.id,
        name: permission.ctl_permissions.name,
        description: permission.ctl_permissions.description,
        active: permission.ctl_permissions.active,
      })) as T[],
      undefined,
      route.parent
        ? new RouteHttpDto<T>(
            route.parent.name,
            route.parent.description ?? '',
            route.parent.icon,
            route.parent.uri,
            route.parent.active,
            route.parent.show,
            Number(route.parent.order),
            route.parent.required_auth,
            route.parent.id,
            route.parent.title,
          )
        : undefined,
      undefined,
      status,
    );
  }
}
