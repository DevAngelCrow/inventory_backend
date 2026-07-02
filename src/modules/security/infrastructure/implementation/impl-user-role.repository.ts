import { Pagination } from '@/shared/domain/value-object/pagination';
import { PaginationParams } from '@/shared/domain/value-object/pagination-params';
import { UserRoleAggregate } from '../../domain/aggregates/user-role.aggregate';
import { UserRoleRepository } from '../../domain/repositories/user-rol-repository';
import { UserRoleIdUser } from '../../domain/value-objects/user-role-value-object/user-role-id-user';
import { PrismaService } from '@/shared/infrastructure/persistence/prisma/prisma.service';
import { TransactionContextService } from '@/shared/infrastructure/services/transaction-context.service';
import { DatabaseException } from '@/shared/infrastructure/exceptions/database.exception';
import { Injectable } from '@nestjs/common';
import { UsersRoleReadRepository } from '../../application/repositories/user-rol-read.repository';
import { UserRolExtendedDto } from '../../application/dtos/user-rol-extended.dto';
import { MultipleStatusCode } from '@/shared/domain/enums/multiple-status';
import { RolDto } from '../../application/dtos/rol.dto';
import { mnt_userGetPayload } from 'generated/prisma/models';

@Injectable()
export class ImplUserRoleRepository
  implements UserRoleRepository, UsersRoleReadRepository
{
  constructor(
    private readonly prisma: PrismaService,
    private readonly transactionContext: TransactionContextService,
  ) {}
  private getPrismaClient() {
    return this.prisma.client;
  }
  public async getUserRole(id: string): Promise<UserRolExtendedDto | null> {
    try {
      const prisma = this.getPrismaClient();
      const userRolDb = await prisma.mnt_user.findUnique({
        where: { id: id },
        include: {
          mnt_people: true,
          mnt_user_rol: {
            where: {
              mnt_role: {
                ctl_status: {
                  code: MultipleStatusCode.ACTIVE,
                },
              },
            },
            include: {
              mnt_role: true,
            },
            orderBy: {
              mnt_user: {
                user_name: 'asc',
              },
            },
          },
        },
      });
      if (!userRolDb) {
        return null;
      }
      return this.mapToReadModel(userRolDb);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Database error: ${error.message}`);
      }
      throw new DatabaseException('Error creating user_rol', 'create');
    }
  }
  async getUserIdsByRoleId(id_rol: string): Promise<string[]> {
    try {
      const prisma = this.getPrismaClient();
      const records = await prisma.mnt_user_rol.findMany({
        where: { id_role: id_rol },
        select: { id_user: true },
      });
      return records.map((r) => r.id_user);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Database error: ${error.message}`);
      }
      throw new DatabaseException('Error fetching user ids by role', 'read');
    }
  }

  async getUserIdsByPermissionId(permissionId: string): Promise<string[]> {
    try {
      const prisma = this.getPrismaClient();
      const records = await prisma.mnt_user_rol.findMany({
        where: {
          mnt_role: {
            rol_permissions: {
              some: { id_permission: permissionId },
            },
          },
        },
        select: { id_user: true },
        distinct: ['id_user'],
      });
      return records.map((r) => r.id_user);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Database error: ${error.message}`);
      }
      throw new DatabaseException(
        'Error fetching user ids by permission',
        'read',
      );
    }
  }

  async create(user_role: UserRoleAggregate): Promise<void> {
    try {
      const prisma = this.getPrismaClient();
      await prisma.mnt_user_rol.createMany({
        data: user_role.getIdRole().map((rol) => ({
          id_user: user_role.getIdUser().value(),
          id_role: rol.value(),
          created_at: new Date(),
        })),
      });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Database error: ${error.message}`);
      }
      throw new DatabaseException('Error creating user_rol', 'create');
    }
  }
  async updateOrCreate(user_role: UserRoleAggregate): Promise<void> {
    try {
      const prisma = this.getPrismaClient();

      await prisma.mnt_user_rol.deleteMany({
        where: {
          id_user: user_role.getIdUser().value(),
        },
      });

      await prisma.mnt_user_rol.createMany({
        data: user_role.getIdRole().map((rol) => ({
          id_user: user_role.getIdUser().value(),
          id_role: rol.value(),
          created_at: new Date(),
        })),
      });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Database error: ${error.message}`);
      }
      throw new DatabaseException('Error creating user_rol', 'create');
    }
  }
  getAllByUserId(_user_id: UserRoleIdUser): Promise<UserRoleAggregate[]> {
    throw new Error('Method not implemented.');
  }
  getAll(
    _pagination_params?: PaginationParams,
  ): Promise<Pagination<UserRoleAggregate> | UserRoleAggregate[]> {
    throw new Error('Method not implemented.');
  }
  private mapToReadModel(
    user_rol_db: mnt_userGetPayload<{
      include: {
        mnt_people: true;
        mnt_user_rol: {
          include: {
            mnt_role: true;
          };
        };
      };
    }>,
  ): UserRolExtendedDto {
    return new UserRolExtendedDto(
      user_rol_db.user_name,
      user_rol_db.mnt_people.email,
      user_rol_db.is_validated,
      user_rol_db.id_status,
      user_rol_db.id,
      user_rol_db.mnt_user_rol.map(
        (ur) =>
          new RolDto(
            ur.mnt_role.name,
            ur.mnt_role.description,
            ur.mnt_role.id_status,
            ur.mnt_role.code,
            ur.mnt_role.id,
          ),
      ),
    );
  }
}
