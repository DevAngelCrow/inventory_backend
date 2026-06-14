import { DocumentDto } from '../../../dtos/document.dto';

export class UpdateDocumentCommand {
  constructor(public readonly document_dto: DocumentDto) {}
}
