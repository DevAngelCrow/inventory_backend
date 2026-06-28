import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/shared/infrastructure/persistence/prisma/prisma.service';
import { DocumentReadRepository } from '../../application/repositories/document-read.repository';
import { PaginationParams } from '@/shared/domain/value-object/pagination-params';
import { Pagination } from '@/shared/domain/value-object/pagination';
import { Document } from '../../domain/entities/document';
import { DocumentId } from '../../domain/value-objects/document-value-object/document-id';
import { DocumentNumberDoc } from '../../domain/value-objects/document-value-object/document-number-doc';
import { DocumentDescription } from '../../domain/value-objects/document-value-object/document-description';
import { DocumentIdPerson } from '../../domain/value-objects/document-value-object/document-id-people';
import { DocumentIdTypeDocument } from '../../domain/value-objects/document-value-object/document-id-type-document';
import { DocumentActive } from '../../domain/value-objects/document-value-object/document-active';

@Injectable()
export class ImplDocumentReadRepository implements DocumentReadRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getAll(pagination_params?: PaginationParams, filter?: string): Promise<Pagination<Document> | Document[]> {
    const docsDb = await this.prisma.client.mnt_document.findMany();
    return docsDb.map(d => Document.create({
        id: d.id ? new DocumentId(d.id) : null,
        number_document: new DocumentNumberDoc(d.document_number),
        description: d.description ? new DocumentDescription(d.description) : undefined,
        id_people: new DocumentIdPerson(d.id_people),
        id_type_document: new DocumentIdTypeDocument(d.id_document_type), // Map it correctly based on schema
        active: new DocumentActive(d.active),
    }));
  }

  async getOneById(id: DocumentId): Promise<Document | null> {
    const d = await this.prisma.client.mnt_document.findUnique({ where: { id: id.value() } });
    if (!d) return null;
    return Document.create({
        id: d.id ? new DocumentId(d.id) : null,
        number_document: new DocumentNumberDoc(d.document_number),
        description: d.description ? new DocumentDescription(d.description) : undefined,
        id_people: new DocumentIdPerson(d.id_people),
        id_type_document: new DocumentIdTypeDocument(d.id_document_type),
        active: new DocumentActive(d.active),
    });
  }
}
