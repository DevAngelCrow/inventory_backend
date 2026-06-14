import { DocumentTypeDto } from '../../../dtos/document-type.dto';

export class CreateDocumentTypeCommand {
  constructor(public readonly document_type_dto: DocumentTypeDto) {}
}
