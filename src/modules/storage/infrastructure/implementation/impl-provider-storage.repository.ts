import { Injectable } from '@nestjs/common';
import { ProviderStorage } from '../../domain/entities/provider-storage';
import { ProviderStorageRepository } from '../../domain/repositories/provider-storage.repository';
import { ProviderStorageId } from '../../domain/value-objects/provider-storage-value-object/provider-storage-id';
import { PrismaService } from 'src/shared/infrastructure/persistence/prisma/prisma.service';
import { ctl_provider_storage } from 'generated/prisma/client';
import { NotFoundException } from '@/shared/domain/exceptions/not-found.exception';
import { DatabaseException } from '@/shared/infrastructure/exceptions/database.exception';
import { Pagination } from '@/shared/domain/value-object/pagination';
import { PaginationParams } from '@/shared/domain/value-object/pagination-params';
import { EntityList } from '@/shared/domain/value-object/entity-list';
import { TotalItems } from '@/shared/domain/value-object/total-items';
import { TotalPages } from '@/shared/domain/value-object/total-page';
import { ProviderStorageCode } from '../../domain/value-objects/provider-storage-value-object/provider-storage-code';
import { TransactionContextService } from '@/shared/infrastructure/services/transaction-context.service';

@Injectable()
export class ImplProviderStorageRepository implements ProviderStorageRepository {
  private providerStorages: ProviderStorage[] = [];
  constructor(
    private readonly prisma: PrismaService,
    private readonly transactionContext: TransactionContextService,
  ) {}
  private getPrismaClient() {
    return this.transactionContext.getTransaction() ?? this.prisma;
  }
  async create(providerStorage: ProviderStorage): Promise<void> {
    try {
      const prisma = this.getPrismaClient();
      await prisma.ctl_provider_storage.create({
        data: {
          name: providerStorage.getName().value(),
          code: providerStorage.getCode().value(),
          description: providerStorage.getDescription().value(),
          active: providerStorage.getActive().value(),
        },
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Error creating provider storage: ${error.message}`);
      }
      throw new DatabaseException('Error creating provider storage', 'create');
    }
  }
  async update(providerStorage: ProviderStorage): Promise<void> {
    try {
      const prisma = this.getPrismaClient();
      await prisma.ctl_provider_storage.update({
        where: {
          id: providerStorage.getId()?.value(),
        },
        data: {
          name: providerStorage.getName().value(),
          code: providerStorage.getCode().value(),
          description: providerStorage.getDescription().value(),
          active: providerStorage.getActive().value(),
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error updating provider storage: ${error.message}`);
      }
      throw new DatabaseException('Error updating provider storage', 'update');
    }
  }
  async getAll(
    pagination_params?: PaginationParams,
    filter?: string,
  ): Promise<Pagination<ProviderStorage> | ProviderStorage[]> {
    try {
      const prisma = this.getPrismaClient();
      const where = {
        name: {
          contains: filter,
          mode: 'insensitive' as const,
        },
      };
      const providerStoragesDb = await prisma.ctl_provider_storage.findMany({
        skip:
          pagination_params?.getPage().value() &&
          pagination_params?.getPerPage().value()
            ? (pagination_params.getPage().value() - 1) *
              pagination_params.getPerPage().value()
            : undefined,
        take: pagination_params?.getPerPage().value(),
        where,
        orderBy: {
          id: 'asc',
        },
      });
      const total = await prisma.ctl_provider_storage.count({ where });

      const providerStorages = providerStoragesDb.map((providerStorageDb) =>
        this.mapToDomain(providerStorageDb),
      );

      this.providerStorages = providerStorages;

      if (!pagination_params) {
        return providerStorages;
      }

      const entityList: EntityList<ProviderStorage> =
        providerStorages.length > 0
          ? new EntityList<ProviderStorage>(providerStorages)
          : new EntityList<ProviderStorage>([]);

      return new Pagination<ProviderStorage>(
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
        throw new Error(`Error getting provider storages: ${error.message}`);
      }
      throw new DatabaseException('Error getting provider storages', 'getAll');
    }
  }
  async getOneById(id: ProviderStorageId): Promise<ProviderStorage | null> {
    try {
      const prisma = this.getPrismaClient();
      const providerStorageDb = await prisma.ctl_provider_storage.findFirst({
        where: {
          id: id.value(),
        },
      });
      if (!providerStorageDb) {
        return null;
      }
      const providerStorage = this.mapToDomain(providerStorageDb);
      return providerStorage;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error getting provider storage: ${error.message}`);
      }
      throw new NotFoundException('ProviderStorage', id.value().toString());
    }
  }
  async getOneByCode(
    code: ProviderStorageCode,
  ): Promise<ProviderStorage | null> {
    try {
      const prisma = this.getPrismaClient();
      const providerStorageDb = await prisma.ctl_provider_storage.findFirst({
        where: {
          code: code.value(),
        },
      });
      if (!providerStorageDb) {
        return null;
      }
      const providerStorage = this.mapToDomain(providerStorageDb);
      return providerStorage;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error getting provider storage: ${error.message}`);
      }
      throw new NotFoundException('ProviderStorage', code.value());
    }
  }
  async toggleStatus(id: ProviderStorageId): Promise<ProviderStorage> {
    try {
      const prisma = this.getPrismaClient();
      const providerStorageDb = await prisma.ctl_provider_storage.update({
        where: {
          id: id.value(),
        },
        data: {
          active: false,
        },
      });
      if (!providerStorageDb) {
        throw new NotFoundException('ProviderStorage', id.value().toString());
      }
      const providerStorage = this.mapToDomain(providerStorageDb);
      return providerStorage;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error deleting provider storage: ${error.message}`);
      }
      throw new DatabaseException('Error deleting provider storage', 'delete');
    }
  }
  private mapToDomain(
    prismaProviderStorage: ctl_provider_storage,
  ): ProviderStorage {
    return ProviderStorage.create({
      id: prismaProviderStorage.id,
      name: prismaProviderStorage.name,
      code: prismaProviderStorage.code,
      description: prismaProviderStorage.description,
      active: prismaProviderStorage.active,
    });
  }
}
