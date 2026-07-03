import { PrismaService } from 'src/shared/infrastructure/persistence/prisma/prisma.service';
import { TransactionContextService } from '@/shared/infrastructure/services/transaction-context.service';
import { UserRepository } from '../../domain/repositories/user-repository';
import { User } from '../../domain/entities/user';
import { DatabaseException } from '@/shared/infrastructure/exceptions/database.exception';
import { Injectable } from '@nestjs/common';
import { PasswordHasher } from '@/modules/auth/infrastructure/services/password-hasher.service';
import {
  mnt_user,
  Prisma,
  mnt_people,
  ctl_status,
  mnt_user_rol,
  mnt_role,
  ctl_permissions,
  ctl_category_status,
  mnt_password_history,
} from 'generated/prisma/client';
import { UserId } from '../../domain/value-objects/user-value-object/user-id';
import {
  CategoryStatus,
  MultipleStatusCode,
} from '@/shared/domain/enums/multiple-status';
import { UserReadRepository } from '../../application/repositories/user-read.repository';
import { Pagination } from '@/shared/domain/value-object/pagination';
import { NotFoundException } from '@/shared/domain/exceptions/not-found.exception';
import { PaginationParams } from '@/shared/domain/value-object/pagination-params';
import { UserDto } from '../../application/dtos/user.dto';
import { GlobalStatusDto } from '@/modules/catalogs/application/dtos/global-status.dto';
import { mnt_userGetPayload } from 'generated/prisma/models';
import { EntityList } from '@/shared/domain/value-object/entity-list';
import { TotalItems } from '@/shared/domain/value-object/total-items';
import { TotalPages } from '@/shared/domain/value-object/total-page';
import { UserAuthDto } from '../../application/dtos/user-auth.dto';
import { UserName } from '../../domain/value-objects/user-value-object/user-name';
import { UserPassword } from '../../domain/value-objects/user-value-object/user-password';
import { InfrastructureException } from '@/shared/infrastructure/exceptions/infrastructure.exception';
import { ConfigService } from '@nestjs/config';
import { ConflictException } from '@/shared/domain/exceptions/conflict-exception';

@Injectable()
export class ImplUserRepository implements UserRepository, UserReadRepository {
  private users: UserDto[] = [];
  constructor(
    private readonly prisma: PrismaService,
    private readonly transactionContext: TransactionContextService,
    private readonly configService: ConfigService,
  ) {}
  public async getOneUserByEmail(email: string): Promise<UserDto | null> {
    try {
      const prisma = this.getPrismaClient();
      const userDb = await prisma.mnt_user.findFirst({
        where: {
          mnt_people: {
            email: email,
          },
        },
        include: {
          ctl_status: true,
          mnt_people: true,
        },
      });
      if (!userDb) {
        return null;
      }
      const userDto = this.mapToReadModel(userDb);
      return userDto;
    } catch {
      return null;
      // if (error instanceof Error) {
      //   throw new Error(`Error getting user by email: ${error.message}`);
      // }
      // throw new DatabaseException('Error getting user by email', 'getOneByEmail');
    }
  }
  public async updateNameUser(user_name: UserName, id: UserId): Promise<void> {
    try {
      const prisma = this.getPrismaClient();
      await prisma.mnt_user.update({
        where: {
          id: id.value(),
        },
        data: {
          user_name: user_name.value(),
        },
      });
    } catch (error) {
      if ((error as { code?: string })?.code === 'P2025') {
        throw new NotFoundException('User', id.value());
      }
      if (error instanceof Error) {
        throw new Error(`Error updating user name: ${error.message}`);
      }
      throw new DatabaseException('Error updating user name', 'updateNameUser');
    }
  }
  public async getAllUsers(
    paginationParams?: PaginationParams,
    filter?: { name?: string; email?: string; status?: string },
  ): Promise<Pagination<UserDto> | UserDto[]> {
    try {
      const prisma = this.getPrismaClient();
      const where = {
        user_name: {
          contains: filter?.name,
          mode: Prisma.QueryMode.insensitive,
        },
        id_status: filter?.status,
      };
      const usersDb = await prisma.mnt_user.findMany({
        skip:
          paginationParams?.getPage().value() &&
          paginationParams?.getPerPage().value()
            ? (paginationParams.getPage().value() - 1) *
              paginationParams.getPerPage().value()
            : undefined,
        take: paginationParams?.getPerPage().value(),
        where,
        orderBy: {
          user_name: 'asc',
        },
        include: {
          ctl_status: true,
          mnt_people: true,
        },
      });
      const totalCount = await prisma.mnt_user.count({ where });
      const users =
        usersDb.length > 0
          ? usersDb.map(
              (
                userDb: mnt_userGetPayload<{
                  include: { ctl_status: true; mnt_people: true };
                }>,
              ) => this.mapToReadModel(userDb),
            )
          : [];
      this.users = users;
      if (!paginationParams) {
        return this.users;
      }

      const entityList: EntityList<UserDto> =
        usersDb.length > 0
          ? new EntityList<UserDto>(this.users)
          : new EntityList<UserDto>([]);

      return new Pagination<UserDto>(
        entityList,
        paginationParams.getPage(),
        paginationParams.getPerPage(),
        new TotalItems(totalCount),
        new TotalPages(
          Math.ceil(totalCount / paginationParams.getPerPage().value()),
        ),
      );
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error getting users: ${error.message}`);
      }
      throw new DatabaseException('Error getting users', 'getAll');
    }
  }
  public async getOneByUserNameForAuth(
    user_name: string,
  ): Promise<UserAuthDto | null> {
    try {
      const prisma = this.getPrismaClient();
      const userDb = await prisma.mnt_user.findFirst({
        where: {
          user_name: user_name,
        },
        include: {
          ctl_status: true,
          mnt_people: true,
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
      if (!userDb) {
        return null;
      }
      const permissions = userDb.mnt_user_rol
        .flatMap((userRol) => userRol.mnt_role.rol_permissions)
        .flatMap((rolPermission) => rolPermission.ctl_permissions)
        .map((permission) => permission.name);

      const userEntity = new UserAuthDto(
        userDb.id,
        userDb.id_people,
        userDb.user_name,
        userDb.id_status,
        userDb.last_access,
        userDb.is_validated,
        permissions,
      );
      return userEntity;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error getting user by user_name: ${error.message}`);
      }
      throw new DatabaseException(
        'Error getting user by user_name',
        'getOneByUserName',
      );
    }
  }
  public async getOneByIdForAuth(id: string): Promise<UserAuthDto | null> {
    try {
      const prisma = this.getPrismaClient();
      const userDb = await prisma.mnt_user.findFirst({
        where: {
          id: id,
        },
        include: {
          ctl_status: true,
          mnt_people: true,
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
      if (!userDb) {
        return null;
      }
      const permissions = userDb.mnt_user_rol
        .flatMap((userRol) => userRol.mnt_role.rol_permissions)
        .flatMap((rolPermission) => rolPermission.ctl_permissions)
        .map((permission) => permission.name);

      const userEntity = new UserAuthDto(
        userDb.id,
        userDb.id_people,
        userDb.user_name,
        userDb.id_status,
        userDb.last_access,
        userDb.is_validated,
        permissions,
      );
      return userEntity;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error getting user by user_name: ${error.message}`);
      }
      throw new DatabaseException(
        'Error getting user by user_name',
        'getOneByUserName',
      );
    }
  }
  public async getOneById(id: string): Promise<UserDto | null> {
    try {
      const prisma = this.getPrismaClient();
      const userDb: mnt_user | null = await prisma.mnt_user.findFirst({
        where: {
          id: id,
        },
      });
      if (!userDb) {
        return null;
      }
      const userDto = new UserDto(
        userDb.id_people,
        userDb.user_name,
        '*',
        userDb.id_status,
        userDb.last_access,
        userDb.is_validated,
        [],
        userDb.id,
      );
      return userDto;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error getting user by user_name: ${error.message}`);
      }
      throw new DatabaseException(
        'Error getting user by user_name',
        'getOneByUserName',
      );
    }
  }
  public async markEmailAsVerified(user_id: UserId): Promise<void> {
    try {
      const prisma = this.getPrismaClient();
      const status = await prisma.ctl_status.findFirst({
        where: {
          code: MultipleStatusCode.ACTIVE,
          ctl_category_status: {
            name: CategoryStatus.NAME,
          },
        },
      });
      if (!status?.id) {
        throw new DatabaseException('Status not found', 'markEmailAsVerified');
      }
      await prisma.mnt_user.update({
        where: { id: user_id.value() },
        data: {
          is_validated: true,
          email_verified_at: new Date(),
          id_status: status.id,
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error creating user: ${error.message}`);
      }
      throw new DatabaseException('Error creating user', 'markEmailAsVerified');
    }
  }

  private getPrismaClient() {
    return this.prisma.client;
  }
  async create(user: User): Promise<User> {
    try {
      const prisma = this.getPrismaClient();
      const userCreatedPrisma = await prisma.mnt_user.create({
        data: {
          id_people: user.getIdPeople().value(),
          user_name: user.getUserName().value(),
          password: user.getPassword().value(),
          id_status: user.getIdStatus().value(),
          last_access: new Date(user.getLastAccess().value()),
          is_validated: user.getIsValidated().value(),
        },
      });
      const userEntityCreated = User.create({
        id: userCreatedPrisma.id,
        id_people: userCreatedPrisma.id_people,
        user_name: userCreatedPrisma.user_name,
        password: userCreatedPrisma.password,
        id_status: userCreatedPrisma.id_status,
        last_access: userCreatedPrisma.last_access,
        is_validated: userCreatedPrisma.is_validated,
      });
      return userEntityCreated;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException(
            'A user with the given credentials already exists',
          );
        }
        if (error.code === 'P2003') {
          throw new ConflictException('Referenced record does not exist');
        }
        throw new DatabaseException('Database constraint error', 'create');
      }
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new DatabaseException('Error creating user', 'create');
    }
  }
  public updateStatusUser(id: UserId): Promise<void> {
    try {
      console.log('updateStatusUser method called with id:', id.value());
      throw new Error('Method not implemented.');
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Error updating user status: ${error.message}`);
      }
      throw new DatabaseException(
        'Error updating user status',
        'updateStatusUser',
      );
    }
  }
  async getOneByUserName(
    user_name: string,
  ): Promise<{ user: UserDto; permissions: string[] } | null> {
    try {
      const prisma = this.getPrismaClient();
      const userDb = await prisma.mnt_user.findFirst({
        where: {
          user_name: user_name,
        },
        include: {
          ctl_status: true,
          mnt_people: true,
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
      if (!userDb) {
        return null;
      }
      const permissions = userDb.mnt_user_rol
        .flatMap((userRol) => userRol.mnt_role.rol_permissions)
        .flatMap((rolPermission) => rolPermission.ctl_permissions)
        .map((permission) => permission.name);
      const userDto = new UserDto(
        userDb.id_people,
        userDb.user_name,
        userDb.password,
        userDb.id_status,
        userDb.last_access,
        userDb.is_validated,
        [],
        userDb.id,
      );
      return {
        user: userDto,
        permissions,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error getting user by user_name: ${error.message}`);
      }
      throw new DatabaseException(
        'Error getting user by user_name',
        'getOneByUserName',
      );
    }
  }
  public async resetPasswordUser(
    id: UserId,
    password: UserPassword,
    _token: string,
  ): Promise<void> {
    try {
      const hasher = new PasswordHasher();
      const passwordHash = await hasher.hash(password.value());
      const prisma = this.getPrismaClient();
      const HISTORY_COUNT =
        Number(this.configService.get<string>('PASSWORD_HISTORY_COUNT')) || 5;

      const userRegister = await prisma.mnt_user.findFirst({
        where: { id: id.value() },
        select: { password: true },
      });
      if (!userRegister) {
        throw new InfrastructureException('404', 'Usuario no encontrado');
      }

      // Build list of hashes to check: current + history
      const history = await prisma.mnt_password_history.findMany({
        where: { id_user: id.value() },
        orderBy: { created_at: 'desc' },
        take: HISTORY_COUNT - 1,
        select: { password_hash: true },
      });
      const hashesToCheck = [
        userRegister.password,
        ...history.map((h) => h.password_hash),
      ];
      for (const oldHash of hashesToCheck) {
        if (await hasher.compare(password.value(), oldHash)) {
          throw new InfrastructureException(
            `La nueva contraseña no puede ser igual a las últimas ${HISTORY_COUNT} contraseñas utilizadas`,
            'resetPasswordUser',
          );
        }
      }

      // Save current password to history before overwriting
      await prisma.mnt_password_history.create({
        data: { id_user: id.value(), password_hash: userRegister.password },
      });

      // Prune old history entries beyond the limit
      const totalHistory = await prisma.mnt_password_history.count({
        where: { id_user: id.value() },
      });
      if (totalHistory > HISTORY_COUNT) {
        const toDelete = await prisma.mnt_password_history.findMany({
          where: { id_user: id.value() },
          orderBy: { created_at: 'asc' },
          take: totalHistory - HISTORY_COUNT,
          select: { id: true },
        });
        await prisma.mnt_password_history.deleteMany({
          where: { id: { in: toDelete.map((h) => h.id) } },
        });
      }

      await prisma.mnt_user.update({
        where: { id: id.value() },
        data: { password: passwordHash },
      });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error reset password user: ${error.message}`);
      }
      throw new DatabaseException(
        'Error reset password user',
        'resetPasswordUser',
      );
    }
  }
  private mapToReadModel(
    user: mnt_userGetPayload<{
      include: { ctl_status: true; mnt_people: true };
    }>,
  ): UserDto<GlobalStatusDto> {
    const userDto = new UserDto<GlobalStatusDto>(
      user.id_people,
      user.user_name,
      '*',
      user.id_status,
      user.last_access,
      user.is_validated,
      [],
      user.id,
      undefined,
      new GlobalStatusDto(
        user.ctl_status.name,
        user.ctl_status.description,
        user.ctl_status.code,
        user.ctl_status.active,
        user.ctl_status.state_color,
        user.ctl_status.text_color,
        user.ctl_status.id_category_status,
      ),
      user.mnt_people?.email ?? undefined,
      user.mnt_people?.phone ?? undefined,
    );
    return userDto;
  }
}
