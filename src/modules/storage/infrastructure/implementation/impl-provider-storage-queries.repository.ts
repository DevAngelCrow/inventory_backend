import { Injectable } from '@nestjs/common';
import { ProviderStorage } from '../../domain/entities/provider-storage';
import { ProviderStorageQueriesRepository } from '../../application/repositories/provider-storage-read.repository';
import { ProviderStorageId } from '../../domain/value-objects/provider-storage-value-object/provider-storage-id';
import { PrismaService } from 'src/shared/infrastructure/persistence/prisma/prisma.service';
import { ctl_provider_storage } from 'generated/prisma/client';
import { Pagination } from '@/shared/domain/value-object/pagination';
import { PaginationParams } from '@/shared/domain/value-object/pagination-params';
import { EntityList } from '@/shared/domain/value-object/entity-list';
import { TotalItems } from '@/shared/domain/value-object/total-items';
import { TotalPages } from '@/shared/domain/value-object/total-page';
import { ProviderStorageCode } from '../../domain/value-objects/provider-storage-value-object/provider-storage-code';
import { DatabaseException } from '@/shared/infrastructure/exceptions/database.exception';

@Injectable()
export class ImplProviderStorageQueriesRepository implements ProviderStorageQueriesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getAll(
    pagination_params?: PaginationParams,
    filter?: string,
  ): Promise<Pagination<ProviderStorage> | ProviderStorage[]> {
    try {
      const where = {
        name: {
          contains: filter,
          mode: 'insensitive' as const,
        },
      };
      const [providerStoragesDb, total] = await Promise.all([
        this.prisma.ctl_provider_storage.findMany({
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
        }),
        this.prisma.ctl_provider_storage.count({ where }),
      ]);

      const providerStorages = providerStoragesDb.map((providerStorageDb) =>
        this.mapToDomain(providerStorageDb),
      );

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
      const providerStorageDb =
        await this.prisma.ctl_provider_storage.findFirst({
          where: {
            id: id.value(),
          },
        });
      if (!providerStorageDb) {
        return null;
      }
      return this.mapToDomain(providerStorageDb);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error getting provider storage: ${error.message}`);
      }
      throw new DatabaseException(
        'Error getting provider storage',
        'getOneById',
      );
    }
  }

  async getOneByCode(
    code: ProviderStorageCode,
  ): Promise<ProviderStorage | null> {
    try {
      const providerStorageDb =
        await this.prisma.ctl_provider_storage.findFirst({
          where: {
            code: code.value(),
          },
        });
      if (!providerStorageDb) {
        return null;
      }
      return this.mapToDomain(providerStorageDb);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error getting provider storage: ${error.message}`);
      }
      throw new DatabaseException(
        'Error getting provider storage',
        'getOneByCode',
      );
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
