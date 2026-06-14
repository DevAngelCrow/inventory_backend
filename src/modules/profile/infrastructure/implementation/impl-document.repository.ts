import { Injectable } from '@nestjs/common';
import { Document } from '../../domain/entities/document';
import { DocumentRepository } from '../../domain/repositories/document.repository';
import { DocumentId } from '../../domain/value-objects/document-value-object/document-id';
import { PrismaService } from 'src/shared/infrastructure/persistence/prisma/prisma.service';
import { TransactionContextService } from '@/shared/infrastructure/services/transaction-context.service';
import { mnt_document } from 'generated/prisma/client';
import { NotFoundException } from '@/shared/domain/exceptions/not-found.exception';
import { DatabaseException } from '@/shared/infrastructure/exceptions/database.exception';
import { Pagination } from '@/shared/domain/value-object/pagination';
import { PaginationParams } from '@/shared/domain/value-object/pagination-params';
import { EntityList } from '@/shared/domain/value-object/entity-list';
import { TotalItems } from '@/shared/domain/value-object/total-items';
import { TotalPages } from '@/shared/domain/value-object/total-page';
import { DocumentReadRepository } from '../../application/repositories/document-read.repository';

@Injectable()
export class ImplDocumentRepository
  implements DocumentRepository, DocumentReadRepository
{
  private documents: Document[] = [];
  constructor(
    private readonly prisma: PrismaService,
    private readonly transactionContext: TransactionContextService,
  ) {}

  private getPrismaClient() {
    return this.transactionContext.getTransaction() ?? this.prisma;
  }
  async create(document: Document): Promise<Document> {
    try {
      const prisma = this.getPrismaClient();
      const documentDb = await prisma.mnt_document.create({
        data: {
          document_number: document.getNumberDocument().value(),
          description: document.getDescription()?.value(),
          id_people: document.getIdPeople().value(),
          id_document_type: document.getIdTypeDocument().value(),
          active: document.getActive()?.value(),
        },
      });
      const documentCreateEntity = Document.create({
        number_document: document.getNumberDocument().value(),
        description: document.getDescription()?.value(),
        id_people: document.getIdPeople().value(),
        id_type_document: document.getIdTypeDocument().value(),
        active: document.getActive()?.value(),
        id: documentDb.id,
      });
      return documentCreateEntity;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Error creating document: ${error.message}`);
      }
      throw new DatabaseException('Error creating document', 'create');
    }
  }
  async update(document: Document): Promise<void> {
    try {
      const prisma = this.getPrismaClient();
      await prisma.mnt_document.upsert({
        where: {
          id: document.getId()?.value(),
          document_number: document.getNumberDocument().value(),
        },
        update: {
          document_number: document.getNumberDocument().value(),
          description: document.getDescription()?.value(),
          id_people: document.getIdPeople().value(),
          id_document_type: document.getIdTypeDocument().value(),
          active: document.getActive().value(),
        },
        create: {
          document_number: document.getNumberDocument().value(),
          description: document.getDescription()?.value(),
          id_people: document.getIdPeople().value(),
          id_document_type: document.getIdTypeDocument().value(),
          active: document.getActive().value(),
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error updating document: ${error.message}`);
      }
      throw new DatabaseException('Error updating document', 'update');
    }
  }
  async getAll(
    pagination_params?: PaginationParams,
    filter?: string,
  ): Promise<Pagination<Document> | Document[]> {
    try {
      const where = {
        document_number: {
          contains: filter,
          mode: 'insensitive' as const,
        },
      };
      const prisma = this.getPrismaClient();
      const documentsDb = await prisma.mnt_document.findMany({
        skip:
          pagination_params?.getPage().value() &&
          pagination_params?.getPerPage().value()
            ? (pagination_params.getPage().value() - 1) *
              pagination_params.getPerPage().value()
            : undefined,
        take: pagination_params?.getPerPage().value(),
        where,
        orderBy: {
          id_document_type: 'asc',
        },
      });
      const total = await prisma.mnt_document.count({ where });

      const documents = documentsDb.map((documentDb) =>
        this.mapToDomain(documentDb),
      );

      this.documents = documents;

      if (!pagination_params) {
        return documents;
      }

      const entityList: EntityList<Document> =
        documents.length > 0
          ? new EntityList<Document>(documents)
          : new EntityList<Document>([]);

      return new Pagination<Document>(
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
        throw new Error(`Error getting documents: ${error.message}`);
      }
      throw new DatabaseException('Error getting documents', 'getAll');
    }
  }
  async getOneById(id: DocumentId): Promise<Document | null> {
    try {
      const prisma = this.getPrismaClient();
      const documentDb = await prisma.mnt_document.findFirst({
        where: {
          id: id.value(),
        },
      });
      if (!documentDb) {
        return null;
      }
      const document = this.mapToDomain(documentDb);
      return document;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error getting document: ${error.message}`);
      }
      throw new NotFoundException('Document', id.value().toString());
    }
  }
  async delete(id: DocumentId): Promise<void> {
    try {
      const prisma = this.getPrismaClient();
      const documentDb = await prisma.mnt_document.update({
        where: {
          id: id.value(),
        },
        data: {
          active: false,
        },
      });
      if (!documentDb) {
        throw new NotFoundException('Document', id.value().toString());
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error deleting document: ${error.message}`);
      }
      throw new DatabaseException('Error deleting document', 'delete');
    }
  }
  private mapToDomain(prismaDocument: mnt_document): Document {
    return Document.create({
      id: prismaDocument.id,
      number_document: prismaDocument.document_number,
      id_people: prismaDocument.id_people,
      id_type_document: prismaDocument.id_document_type,
      active: prismaDocument.active,
      description: prismaDocument.description ?? undefined,
    });
  }
}
