import { UpdateDocumentCommand } from '../../document/commands/update-document/update-document.command';
import { UpdateDocumentHandler } from '../../document/commands/update-document/update-document.handler';
import { DocumentDto } from '../../dtos/document.dto';
export class DocumentUpdateService {
  constructor(private readonly documentUpdate: UpdateDocumentHandler) {}
  async run(document_dto: DocumentDto): Promise<void> {
    const documentCommand = new UpdateDocumentCommand(document_dto);
    return await this.documentUpdate.execute(documentCommand);
  }
}
