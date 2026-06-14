import { DocumentType } from '../entities/document-type';
import { DocumentTypeId } from '../value-objects/document-type-value-object/document-type-id';

export abstract class DocumentTypeRepository {
  abstract create(documentType: DocumentType): Promise<void>;
  abstract update(documentType: DocumentType): Promise<void>;
  abstract toggleStatus(id: DocumentTypeId): Promise<DocumentType>;
}
