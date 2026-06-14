import { Injectable } from '@nestjs/common';
import { DocumentType } from '../../domain/entities/document-type';
import { DocumentTypeRepository } from '../../domain/repositories/document-type.repository';
import { DocumentTypeId } from '../../domain/value-objects/document-type-value-object/document-type-id';
import { PrismaService } from 'src/shared/infrastructure/persistence/prisma/prisma.service';
import { ctl_document_type } from 'generated/prisma/client';
import { NotFoundException } from '@/shared/domain/exceptions/not-found.exception';
import { DatabaseException } from '@/shared/infrastructure/exceptions/database.exception';
import { Pagination } from '@/shared/domain/value-object/pagination';
import { PaginationParams } from '@/shared/domain/value-object/pagination-params';
import { EntityList } from '@/shared/domain/value-object/entity-list';
import { TotalItems } from '@/shared/domain/value-object/total-items';
import { TotalPages } from '@/shared/domain/value-object/total-page';
import { DocumentTypeReadRepository } from '../../application/repositories/document-type-read.repository';
import { DocumentTypeDto } from '../../application/dtos/document-type.dto';
import { GetBooleanStatusCatalogService } from '@/shared/infrastructure/services/get-status-catalog.service';
import { BooleanStatusData } from '@/shared/infrastructure/interfaces/boolean-status-data.interface';
import { DocumentTypeHttpDto } from '../dtos/http/document-type-http-dto/document-type-http.dto';
import { StatusMapperUtil } from '@/shared/infrastructure/utils/status-mapper.util';

@Injectable()
export class ImplDocumentTypeRepository
  implements DocumentTypeRepository, DocumentTypeReadRepository
{
  private documentTypes: DocumentTypeDto[] = [];
  constructor(private readonly prisma: PrismaService) {}
  async create(documentType: DocumentType): Promise<void> {
    try {
      await this.prisma.ctl_document_type.create({
        data: {
          name: documentType.getName().value(),
          description: documentType.getDescription().value(),
          mask: documentType.getMask()?.value() ?? '',
          active: documentType.getActive().value(),
        },
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Error creating document type: ${error.message}`);
      }
      throw new DatabaseException('Error creating document type', 'create');
    }
  }
  async update(documentType: DocumentType): Promise<void> {
    try {
      await this.prisma.ctl_document_type.update({
        where: {
          id: documentType.getId()?.value(),
        },
        data: {
          name: documentType.getName().value(),
          description: documentType.getDescription().value(),
          mask: documentType.getMask()?.value() ?? '',
          active: documentType.getActive().value(),
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error updating document type: ${error.message}`);
      }
      throw new DatabaseException('Error updating document type', 'update');
    }
  }
  async getAll(
    pagination_params?: PaginationParams,
    filter?: string,
    active?: boolean,
  ): Promise<Pagination<DocumentTypeDto> | DocumentTypeDto[]> {
    try {
      const where = {
        name: {
          contains: filter,
          mode: 'insensitive' as const,
        },
        active: active,
      };
      const [documentTypesDb, total, catalog_status] = await Promise.all([
        this.prisma.ctl_document_type.findMany({
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
        }),
        this.prisma.ctl_document_type.count({ where }),
        GetBooleanStatusCatalogService.getStatus(this.prisma),
      ]);

      const documentTypes =
        documentTypesDb.length > 0
          ? documentTypesDb.map((documentTypeDb: ctl_document_type) =>
              this.mapReadModelToDto(documentTypeDb, catalog_status),
            )
          : [];

      this.documentTypes = documentTypes;

      if (!pagination_params) {
        return this.documentTypes;
      }

      const entityList: EntityList<DocumentTypeDto> =
        documentTypes.length > 0
          ? new EntityList<DocumentTypeDto>(this.documentTypes)
          : new EntityList<DocumentTypeDto>([]);

      return new Pagination<DocumentTypeDto>(
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
        throw new Error(`Error getting document types: ${error.message}`);
      }
      throw new DatabaseException('Error getting document types', 'getAll');
    }
  }
  async getOneById(id: string): Promise<DocumentTypeDto | null> {
    try {
      const documentTypeDb: ctl_document_type | null =
        await this.prisma.ctl_document_type.findFirst({
          where: {
            id: id,
          },
        });
      if (!documentTypeDb) {
        return null;
      }
      const documentType = this.mapReadModelToDto(documentTypeDb);
      return documentType;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error getting document type: ${error.message}`);
      }
      throw new NotFoundException('DocumentType', id.toString());
    }
  }
  async toggleStatus(id: DocumentTypeId): Promise<DocumentType> {
    try {
      const documentTypeDb = await this.getOneById(id.value());
      if (!documentTypeDb) {
        throw new NotFoundException('DocumentType', id.value().toString());
      }
      const documentType = await this.prisma.ctl_document_type.update({
        where: {
          id: id.value(),
        },
        data: {
          active: !documentTypeDb.active,
        },
      });
      const documentTypeEntity = this.mapToDomain(documentType);
      return documentTypeEntity;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error deleting document type: ${error.message}`);
      }
      throw new DatabaseException('Error deleting document type', 'delete');
    }
  }
  private mapToDomain(prismaDocumentType: ctl_document_type): DocumentType {
    return DocumentType.create({
      id: prismaDocumentType.id,
      name: prismaDocumentType.name,
      description: prismaDocumentType.description,
      mask: prismaDocumentType.mask,
      active: prismaDocumentType.active,
    });
  }
  private mapReadModelToDto(
    document_type: ctl_document_type,
    catalog_status?: Map<string, BooleanStatusData>,
  ): DocumentTypeHttpDto {
    const status = StatusMapperUtil.getStatusFromBoolean(
      document_type.active,
      catalog_status,
      'mapReadModelToDto',
    );
    return new DocumentTypeHttpDto(
      document_type.name,
      document_type.description,
      document_type.active,
      document_type.mask,
      document_type.id,
      status,
    );
  }
}
