import { PrismaService } from '@/shared/infrastructure/persistence/prisma/prisma.service';
import { SecurityAuthorizationPort } from '../../domain/ports/security-authorization.port';
import { TransactionContextService } from '@/shared/infrastructure/services/transaction-context.service';
import { Menu } from '../../domain/entities/menu';
import { Menu as MenuInterface } from '../interfaces/menu.interface';
import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { StorageFileReaderPort } from '@/modules/storage/domain/ports/storage-file-reader.port';

const ROLES_CACHE_TTL_MS = 1_800_000;
const MENU_CACHE_TTL_MS = 1_800_000;
const PERMISSIONS_CACHE_TTL_MS = 3_600_000;

interface MenuCreateData<T> {
  id?: string;
  name: string;
  title: string;
  description: string;
  icon: string;
  uri: string;
  order: number;
  active: boolean;
  show: boolean;
  required_auth: boolean;
  parent: T;
  children: T[];
}

@Injectable()
export class ImplSecurityAuthorizationPort implements SecurityAuthorizationPort {
  constructor(
    private readonly prisma: PrismaService,
    private readonly transactionContext: TransactionContextService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly fileReader: StorageFileReaderPort,
  ) {}
  private getPrismaClient() {
    return this.prisma.client;
  }
  async hasRole(role: string[], id_user: string): Promise<boolean> {
    try {
      const cacheKey = `user:${id_user}:roles`;
      let cachedRoles = await this.cacheManager.get<string[]>(cacheKey);
      if (!cachedRoles) {
        const prisma = this.getPrismaClient();
        const user = await prisma.mnt_user.findUnique({
          where: { id: id_user },
          include: {
            mnt_user_rol: {
              include: {
                mnt_role: { select: { name: true } },
              },
            },
          },
        });
        if (!user) {
          return false;
        }
        cachedRoles = user.mnt_user_rol.map((ur) => ur.mnt_role.name);
        await this.cacheManager.set(cacheKey, cachedRoles, ROLES_CACHE_TTL_MS);
      }
      return cachedRoles.some((r) => role.includes(r));
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error(String(error));
      }
    }
  }
  async checkPermission(permission: string, id_user: string): Promise<boolean> {
    try {
      const cacheKey = `user:${id_user}:permissions`;
      let cachedPermissions = await this.cacheManager.get<string[]>(cacheKey);
      if (!cachedPermissions) {
        const prisma = this.getPrismaClient();
        const user = await prisma.mnt_user.findUnique({
          where: { id: id_user },
          include: {
            mnt_user_rol: {
              include: {
                mnt_role: {
                  include: {
                    rol_permissions: {
                      include: {
                        ctl_permissions: {
                          select: { name: true },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        });
        if (!user) {
          return false;
        }
        cachedPermissions = user.mnt_user_rol
          .flatMap((userRol) => userRol.mnt_role.rol_permissions)
          .flatMap((rolPermission) => rolPermission.ctl_permissions)
          .map((perm) => perm.name);
        await this.cacheManager.set(
          cacheKey,
          cachedPermissions,
          PERMISSIONS_CACHE_TTL_MS,
        );
      }
      return cachedPermissions.includes(permission);
    } catch (error) {
      throw new Error(String(error));
    }
  }
  async filterRoutesForUser<T = MenuInterface>(
    id_user: string,
  ): Promise<Menu<T>[]> {
    try {
      const cacheKey = `user:${id_user}:menu`;
      const cached = await this.cacheManager.get<any[]>(cacheKey);
      if (cached) {
        return cached.map((item) =>
          Menu.create<T>(item as unknown as MenuCreateData<T>),
        );
      }

      const prisma = this.getPrismaClient();

      // 1. Obtener IDs de permisos del usuario
      const user = await prisma.mnt_user.findFirst({
        where: { id: id_user },
        include: {
          mnt_user_rol: {
            include: {
              mnt_role: {
                include: {
                  rol_permissions: {
                    include: {
                      ctl_permissions: {
                        select: { id: true },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      });

      if (!user) {
        return [];
      }

      const permissionIds = user.mnt_user_rol
        .flatMap((userRol) => userRol.mnt_role.rol_permissions)
        .flatMap((rolPermission) => rolPermission.ctl_permissions)
        .map((permission) => permission.id);

      // 2. Obtener TODAS las rutas con sus permisos (incluyendo permisos de children)
      const routes = await prisma.mnt_route.findMany({
        where: { show: true },
        include: {
          children: {
            where: { show: true },
            include: {
              mnt_route_permissions: {
                include: {
                  ctl_permissions: {
                    select: {
                      id: true,
                      name: true,
                      description: true,
                      id_category_permissions: true,
                      active: true,
                    },
                  },
                },
              },
            },
          },
          parent: {
            select: {
              id: true,
              name: true,
              description: true,
              icon: true,
              uri: true,
              active: true,
              order: true,
              required_auth: true,
              show: true,
              title: true,
            },
          },
          mnt_route_permissions: {
            include: {
              ctl_permissions: {
                select: {
                  id: true,
                  name: true,
                  description: true,
                  id_category_permissions: true,
                  active: true,
                },
              },
            },
          },
        },
        orderBy: {
          order: 'asc',
        },
      });
      // 3. Función auxiliar para verificar si el usuario tiene acceso a una ruta
      const hasAccessToRoute = (
        routePermissions: {
          id: string;
          id_permission: string;
          id_route: string;
          ctl_permissions: {
            id: string;
            name: string;
            description: string;
            id_category_permissions: string;
            active: boolean;
          };
          created_at: Date | null;
          updated_at: Date | null;
          deleted_at: Date | null;
        }[],
      ) => {
        const routePermissionIds = routePermissions.map(
          (rp) => rp.ctl_permissions.id,
        );

        // Si la ruta no tiene permisos requeridos, no permitir acceso
        if (routePermissionIds.length === 0) {
          return false;
        }

        // Verificar que el usuario tenga TODOS los permisos de esta ruta
        return routePermissionIds.every((permId) =>
          permissionIds.includes(permId),
        );
      };

      // 4. Filtrar rutas padre con sus children filtrados
      const filteredRoutes = routes
        .map((route) => {
          // Filtrar children según permisos del usuario
          const filteredChildren = route.children.filter((child) =>
            hasAccessToRoute(child.mnt_route_permissions),
          );

          return {
            ...route,
            children: filteredChildren,
          };
        })
        .filter((route) => {
          // Solo incluir rutas padre si el usuario tiene acceso a ella
          return hasAccessToRoute(route.mnt_route_permissions);
        });

      // 5. Eliminar duplicados
      const uniqueRoutes = Array.from(
        new Map(filteredRoutes.map((route) => [route.id, route])).values(),
      );

      // 6. Construir datos planos serializables (compatibles con Menu.create())
      const cacheableData = uniqueRoutes.map((route) => ({
        id: route.id,
        name: route.name,
        title: route.title,
        description: route.description ?? '',
        icon: route.icon,
        uri: route.uri,
        order: Number(route.order),
        active: route.active,
        show: route.show,
        required_auth: route.required_auth,
        parent: route.parent
          ? { ...route.parent, order: Number(route.parent.order) }
          : null,
        children: route.children.map((child) => ({
          active: child.active,
          description: child.description ?? '',
          icon: child.icon,
          name: child.name,
          order: Number(child.order),
          required_auth: child.required_auth,
          show: child.show,
          title: child.title,
          uri: child.uri,
          id: child.id,
        })),
      }));

      await this.cacheManager.set(cacheKey, cacheableData, MENU_CACHE_TTL_MS);
      return cacheableData.map((item) =>
        Menu.create<T>(item as unknown as MenuCreateData<T>),
      );
    } catch (error) {
      console.log('Error en filterRoutesForUser:', error);
      throw new Error(String(error));
    }
  }

  async getUserProfileImg(id_user: string): Promise<string | null> {
    const prisma = this.getPrismaClient();
    const user = await prisma.mnt_user.findUnique({
      where: { id: id_user },
      select: {
        mnt_people: { select: { img_path: true } },
      },
    });
    const imgPath = user?.mnt_people?.img_path ?? null;
    if (!imgPath) return null;
    return this.fileReader.readFileAsBase64(imgPath);
  }
}
