import { DocumentDto } from '../../../dtos/document.dto';

export class CreateDocumentCommand {
  constructor(public readonly document_dto: DocumentDto) {}
}
