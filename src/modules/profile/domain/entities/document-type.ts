import { DocumentTypeActive } from '../value-objects/document-type-value-object/document-type-active';
import { DocumentTypeDescription } from '../value-objects/document-type-value-object/document-type-description';
import { DocumentTypeId } from '../value-objects/document-type-value-object/document-type-id';
import { DocumentTypeMask } from '../value-objects/document-type-value-object/document-type-mask';
import { DocumentTypeName } from '../value-objects/document-type-value-object/document-type-name';

export class DocumentType {
  constructor(
    private readonly name: DocumentTypeName,
    private readonly description: DocumentTypeDescription,
    private readonly active: DocumentTypeActive,
    private readonly mask?: DocumentTypeMask,
    private readonly id?: DocumentTypeId,
  ) {}
  static create(data: {
    id?: string;
    name: string;
    description: string;
    active: boolean;
    mask?: string;
  }) {
    return new DocumentType(
      new DocumentTypeName(data.name),
      new DocumentTypeDescription(data.description),
      new DocumentTypeActive(data.active),
      data.mask ? new DocumentTypeMask(data.mask) : undefined,
      data.id ? new DocumentTypeId(data.id) : undefined,
    );
  }
  getId(): DocumentTypeId | undefined {
    return this.id;
  }
  getName(): DocumentTypeName {
    return this.name;
  }
  getDescription(): DocumentTypeDescription {
    return this.description;
  }
  getActive(): DocumentTypeActive {
    return this.active;
  }
  getMask(): DocumentTypeMask | undefined {
    return this.mask;
  }
}
