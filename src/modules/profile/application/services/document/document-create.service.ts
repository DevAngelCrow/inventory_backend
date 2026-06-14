import { CreateDocumentCommand } from '../../document/commands/create-document/create-document.command';
import { CreateDocumentHandler } from '../../document/commands/create-document/create-document.handler';
import { DocumentDto } from '../../dtos/document.dto';
import { Document } from '@/modules/profile/domain/entities/document';
export class DocumentCreateService {
  constructor(private readonly documentCreate: CreateDocumentHandler) {}
  async run(document_dto: DocumentDto): Promise<Document> {
    const documentCommand = new CreateDocumentCommand(document_dto);
    return await this.documentCreate.execute(documentCommand);
  }
}
