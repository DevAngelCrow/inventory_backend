import { Pagination } from '@/shared/domain/value-object/pagination';
import { PaginationParams } from '@/shared/domain/value-object/pagination-params';
import { Rol } from '../../domain/entities/rol';
import { RolRepository } from '../../domain/repositories/rol-repository';
import { PrismaService } from '@/shared/infrastructure/persistence/prisma/prisma.service';
import { TransactionContextService } from '@/shared/infrastructure/services/transaction-context.service';
import { DatabaseException } from '@/shared/infrastructure/exceptions/database.exception';
import { EntityList } from '@/shared/domain/value-object/entity-list';
import { TotalItems } from '@/shared/domain/value-object/total-items';
import { TotalPages } from '@/shared/domain/value-object/total-page';
import { Prisma, mnt_role } from 'generated/prisma/client';
import { RolId } from '../../domain/value-objects/rol-value-object/rol-id';
import { NotFoundException } from '@/shared/domain/exceptions/not-found.exception';
import { Injectable } from '@nestjs/common';
import { RolReadRepository } from '../../application/repositories/rol-read.repository';
import { RolDto } from '../../application/dtos/rol.dto';
import { mnt_roleGetPayload } from 'generated/prisma/models';
import { GlobalStatusDto } from '@/modules/catalogs/application/dtos/global-status.dto';
import { PermissionsDto } from '../../application/dtos/permissions.dto';
import { MultipleStatusId } from '@/shared/domain/enums/multiple-status';
import { CategoryPermissionsDto } from '../../application/dtos/category-permissions.dto';

@Injectable()
export class ImplRolRepository implements RolRepository, RolReadRepository {
  private role: RolDto[] = [];
  constructor(
    private readonly prisma: PrismaService,
    private readonly transactionContext: TransactionContextService,
  ) {}
  async getByCode(code: string): Promise<RolDto | null> {
    try {
      const prisma = this.getPrismaClient();
      const roleDb: mnt_roleGetPayload<{
        include: {
          ctl_status: true;
          rol_permissions: {
            include: {
              ctl_permissions: { include: { ctl_category_permissions: true } };
            };
          };
        };
      }> | null = await prisma.mnt_role.findFirst({
        where: {
          code: code,
        },
        include: {
          ctl_status: true,
          rol_permissions: {
            include: {
              ctl_permissions: {
                include: {
                  ctl_category_permissions: true,
                },
              },
            },
          },
        },
      });
      if (!roleDb) {
        return null;
      }
      const role = this.mapReadModelToDto(roleDb);
      return role;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error creating role: ${error.message}`);
      }
      throw new NotFoundException('Role', code);
    }
  }
  private getPrismaClient() {
    return this.prisma.client;
  }
  async create(rol: Rol): Promise<void> {
    try {
      const prisma = this.getPrismaClient();
      const idPermissions: string[] | [] = rol.getIdPermissions() ?? [];
      await prisma.mnt_role.create({
        data: {
          name: rol.getName().value(),
          description: rol.getDescription().value(),
          id_status: rol.getIdStatus().value(),
          code: rol.getCode().value(),
          created_at: new Date(),
          rol_permissions: {
            create: idPermissions.map((id_permission) => ({
              id_permission,
              created_at: new Date(),
            })),
          },
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
  async update(rol: Rol): Promise<void> {
    try {
      const prisma = this.getPrismaClient();
      const newPermissions: string[] = rol.getIdPermissions() ?? [];
      const roleId = rol.getId()?.value();

      // Obtener permisos actuales
      const currentPermissions = await prisma.rol_permissions.findMany({
        where: { id_role: roleId },
        select: { id_permission: true },
      });

      const currentPermissionIds = currentPermissions.map(
        (p) => p.id_permission,
      );

      // separar para actualizar Ids de permisos
      const toDelete = currentPermissionIds.filter(
        (id) => !newPermissions.includes(id),
      );
      const toCreate = newPermissions.filter(
        (id) => !currentPermissionIds.includes(id),
      );

      // actualizar permisos del rol
      await prisma.mnt_role.update({
        where: {
          id: roleId,
        },
        data: {
          name: rol.getName().value(),
          description: rol.getDescription().value(),
          id_status: rol.getIdStatus().value(),
          code: rol.getCode().value(),
          updated_at: new Date(),
          rol_permissions: {
            deleteMany:
              toDelete.length > 0
                ? {
                    id_permission: { in: toDelete },
                  }
                : undefined,
            create: toCreate.map((id_permission) => ({
              id_permission,
              created_at: new Date(),
            })),
          },
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error updating role: ${error.message}`);
      }
      throw new DatabaseException('Error updating role', 'update');
    }
  }
  async getAll(
    pagination_params?: PaginationParams,
    filter?: string,
    id_status?: string,
  ): Promise<Pagination<RolDto> | RolDto[]> {
    try {
      const prisma = this.getPrismaClient();
      const where = {
        name: {
          contains: filter,
          mode: Prisma.QueryMode.insensitive,
        },
        id_status: id_status,
      };
      const roleDb = await prisma.mnt_role.findMany({
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
        include: {
          ctl_status: true,
          rol_permissions: {
            include: {
              ctl_permissions: {
                include: {
                  ctl_category_permissions: true,
                },
              },
            },
          },
        },
      });
      const total = await prisma.mnt_role.count({ where });

      const roles =
        roleDb.length > 0
          ? roleDb.map(
              (
                roleDb: mnt_roleGetPayload<{
                  include: {
                    ctl_status: true;
                    rol_permissions: {
                      include: {
                        ctl_permissions: {
                          include: { ctl_category_permissions: true };
                        };
                      };
                    };
                  };
                }>,
              ) => this.mapReadModelToDto(roleDb),
            )
          : [];
      this.role = roles;
      if (!pagination_params) {
        return this.role;
      }

      const entityList: EntityList<RolDto> =
        roles.length > 0
          ? new EntityList<RolDto>(this.role)
          : new EntityList<RolDto>([]);

      return new Pagination<RolDto>(
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
        throw new Error(`Error getting roles: ${error.message}`);
      }
      throw new DatabaseException('Error getting roles', 'getAll');
    }
  }
  async getOneById(id: RolId): Promise<Rol | null> {
    try {
      const prisma = this.getPrismaClient();
      const roleDb: mnt_role | null = await prisma.mnt_role.findFirst({
        where: {
          id: id.value(),
        },
      });
      if (!roleDb) {
        return null;
      }
      const role = this.mapToDomain(roleDb);
      return role;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error creating role: ${error.message}`);
      }
      throw new NotFoundException('Role', id.value().toString());
    }
  }
  async getById(id: string): Promise<RolDto | null> {
    try {
      const prisma = this.getPrismaClient();
      const roleDb: mnt_roleGetPayload<{
        include: {
          ctl_status: true;
          rol_permissions: {
            include: {
              ctl_permissions: { include: { ctl_category_permissions: true } };
            };
          };
        };
      }> | null = await prisma.mnt_role.findFirst({
        where: {
          id: id,
        },
        include: {
          ctl_status: true,
          rol_permissions: {
            include: {
              ctl_permissions: {
                include: {
                  ctl_category_permissions: true,
                },
              },
            },
          },
        },
      });
      if (!roleDb) {
        return null;
      }
      const role = this.mapReadModelToDto(roleDb);
      return role;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error creating role: ${error.message}`);
      }
      throw new NotFoundException('Role', id.toString());
    }
  }
  async toggleStatus(id: RolId): Promise<Rol> {
    try {
      const prisma = this.getPrismaClient();

      const roleDb = await this.getOneById(id);
      if (!roleDb) {
        throw new NotFoundException('Role', id.value().toString());
      }
      const rol = await prisma.mnt_role.update({
        where: {
          id: id.value(),
        },
        data: {
          id_status:
            (roleDb?.getIdStatus().value() as MultipleStatusId) ===
            MultipleStatusId.ACTIVE
              ? MultipleStatusId.INACTIVE
              : MultipleStatusId.ACTIVE,
        },
      });
      const rolEntity = this.mapToDomain(rol);
      return rolEntity;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error deleting role: ${error.message}`);
      }
      throw new DatabaseException('Error deleting role', 'delete');
    }
  }
  private mapToDomain(prismaRole: mnt_role): Rol {
    return Rol.create({
      id: prismaRole.id,
      name: prismaRole.name,
      description: prismaRole.description,
      id_status: prismaRole.id_status,
      code: prismaRole.code,
    });
  }
  private mapReadModelToDto(
    rol: mnt_roleGetPayload<{
      include: {
        ctl_status: true;
        rol_permissions: {
          include: {
            ctl_permissions: { include: { ctl_category_permissions: true } };
          };
        };
      };
    }>,
  ): RolDto<GlobalStatusDto> {
    const rolDto = new RolDto<GlobalStatusDto, PermissionsDto>(
      rol.name,
      rol.description,
      rol.id_status,
      rol.code,
      rol.id,
      new GlobalStatusDto(
        rol.ctl_status.name,
        rol.ctl_status.description,
        rol.ctl_status.code,
        rol.ctl_status.active,
        rol.ctl_status.state_color,
        rol.ctl_status.text_color,
        rol.ctl_status.id_category_status,
        rol.ctl_status.id,
      ),
      rol.rol_permissions.map(
        (perm) =>
          new PermissionsDto(
            perm.ctl_permissions.name,
            perm.ctl_permissions.id_category_permissions,
            perm.ctl_permissions.description,
            perm.ctl_permissions.active,
            perm.ctl_permissions.id,
            new CategoryPermissionsDto(
              perm.ctl_permissions.ctl_category_permissions?.name,
              perm.ctl_permissions.ctl_category_permissions?.description,
              perm.ctl_permissions.ctl_category_permissions?.active,
            ),
          ),
      ),
    );
    return rolDto;
  }
}
