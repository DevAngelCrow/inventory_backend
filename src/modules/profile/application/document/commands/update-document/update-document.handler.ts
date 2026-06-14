import { DocumentRepository } from '@/modules/profile/domain/repositories/document.repository';
import { UpdateDocumentCommand } from './update-document.command';
import { Document } from '@/modules/profile/domain/entities/document';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

@CommandHandler(UpdateDocumentCommand)
export class UpdateDocumentHandler implements ICommandHandler<UpdateDocumentCommand> {
  constructor(private readonly repository: DocumentRepository) {}

  async execute(command: UpdateDocumentCommand): Promise<void> {
    const document = Document.create({ ...command.document_dto });
    await this.repository.update(document);
  }
}
