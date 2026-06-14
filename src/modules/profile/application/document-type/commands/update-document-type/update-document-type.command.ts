import { DocumentTypeDto } from '../../../dtos/document-type.dto';

export class UpdateDocumentTypeCommand {
  constructor(public readonly document_type_dto: DocumentTypeDto) {}
}
