import { StorageFiles } from '../../domain/entities/storage-files';
import { StorageFilesRepository } from '../../domain/repositories/storage-files.repository';
import { StorageFilesContentFile } from '../../domain/value-objects/storage-files-value-object/storage-files-content-file';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/shared/infrastructure/persistence/prisma/prisma.service';
import { TransactionContextService } from '@/shared/infrastructure/services/transaction-context.service';
import { DatabaseException } from '@/shared/infrastructure/exceptions/database.exception';
import { StorageFilesPath } from '../../domain/value-objects/storage-files-value-object/storage-files-path';
import { Express } from 'express';
import { StorageBackendRegistry } from '../backends/storage-backend.registry';
import { Pagination } from '@/shared/domain/value-object/pagination';
import { PaginationParams } from '@/shared/domain/value-object/pagination-params';
import { StorageFileListDto } from '../../application/dtos/storage-file-list.dto';
import { EntityList } from '@/shared/domain/value-object/entity-list';
import { TotalItems } from '@/shared/domain/value-object/total-items';
import { TotalPages } from '@/shared/domain/value-object/total-page';

@Injectable()
export class ImplStorageFilesRepository implements StorageFilesRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly transactionContext: TransactionContextService,
    private readonly backends: StorageBackendRegistry,
  ) {}

  private getPrismaClient() {
    return this.prisma.client;
  }
  async upload<T>(storage_file_content: StorageFilesContentFile<T>): Promise<{
    content_file: StorageFilesContentFile<T>;
    path: StorageFilesPath;
  }> {
    try {
      const file = storage_file_content.value() as Express.Multer.File;
      // The backend is selected at registry construction time from the
      // PROVIDER_STORAGE_CODE env var (LOCAL by default). Per-request routing
      // by file/provider can be added later by passing a code argument here.
      const backend = this.backends.resolve();
      const { path } = await backend.upload(file);
      return {
        content_file: storage_file_content,
        path: new StorageFilesPath(path),
      };
    } catch (error) {
      throw new Error('Error uploading file: ' + String(error));
    }
  }
  async create<T>(storage_file: StorageFiles<T>): Promise<StorageFiles<T>> {
    try {
      const prisma = this.getPrismaClient();
      const storageFileCreatePrisma = await prisma.mnt_storage_files.create({
        data: {
          filename: storage_file.getFilename().value(),
          size: storage_file.getSize().value(),
          mime_type: storage_file.getMimeType().value(),
          active: storage_file.getActive().value(),
          id_provider: storage_file.getIdProvider().value(),
          path: storage_file.getPath().value(),
        },
      });
      const storageFileCreate = StorageFiles.create<T>({
        filename: storageFileCreatePrisma.filename,
        id_provider: String(storageFileCreatePrisma.id_provider),
        size: Number(storageFileCreatePrisma.size),
        mime_type: storageFileCreatePrisma.mime_type,
        active: storageFileCreatePrisma.active,
        content_file: storage_file.getContentFile().value(),
        path: storageFileCreatePrisma.path,
        id: storageFileCreatePrisma.id,
      });
      return storageFileCreate;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error creating storage file: ${error.message}`);
      }
      throw new DatabaseException('Error creating storage file', 'create');
    }
  }
  async getAll(
    pagination_params?: PaginationParams,
    id_provider?: string,
  ): Promise<Pagination<StorageFileListDto> | StorageFileListDto[]> {
    try {
      const prisma = this.getPrismaClient();
      const where = { ...(id_provider ? { id_provider } : {}) };
      const skip = pagination_params
        ? (pagination_params.getPage().value() - 1) *
          pagination_params.getPerPage().value()
        : undefined;
      const take = pagination_params?.getPerPage().value();

      const [rows, total] = await Promise.all([
        prisma.mnt_storage_files.findMany({
          where,
          skip,
          take,
          orderBy: { created_at: 'desc' },
        }),
        prisma.mnt_storage_files.count({ where }),
      ]);

      const items: StorageFileListDto[] = rows.map(
        (r) =>
          new StorageFileListDto(
            r.id,
            r.filename,
            r.mime_type,
            Number(r.size),
            r.path,
            r.active,
            r.id_provider,
            r.id_user,
            r.created_at,
          ),
      );

      if (!pagination_params) {
        return items;
      }

      return new Pagination<StorageFileListDto>(
        new EntityList<StorageFileListDto>(items),
        pagination_params.getPage(),
        pagination_params.getPerPage(),
        new TotalItems(Number(total)),
        new TotalPages(
          Math.ceil(total / pagination_params.getPerPage().value()),
        ),
      );
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error listing storage files: ${error.message}`);
      }
      throw new DatabaseException('Error listing storage files', 'getAll');
    }
  }
}
