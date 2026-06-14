import { Pagination } from '@/shared/domain/value-object/pagination';
import { Document } from '../entities/document';
import { DocumentId } from '../value-objects/document-value-object/document-id';
import { PaginationParams } from '@/shared/domain/value-object/pagination-params';

export abstract class DocumentRepository {
  abstract create(document: Document): Promise<Document>;
  abstract update(document: Document): Promise<void>;
  abstract getAll(
    pagination_params?: PaginationParams,
    filter?: string,
  ): Promise<Pagination<Document> | Document[]>;
  abstract getOneById(id: DocumentId): Promise<Document | null>;
  abstract delete(id: DocumentId): Promise<void>;
}
