import { DocumentType } from '../../domain/entities/document-type';

export class DocumentTypeDto {
  constructor(
    public readonly name: string,
    public readonly description: string,
    public readonly active: boolean,
    public readonly mask?: string,
    public readonly id?: string,
  ) {}
  public static fromEntity(document_type: DocumentType): DocumentTypeDto {
    return new DocumentTypeDto(
      document_type.getName().value(),
      document_type.getDescription().value(),
      document_type.getActive().value(),
      document_type.getMask()?.value(),
      document_type.getId()?.value(),
    );
  }
}
