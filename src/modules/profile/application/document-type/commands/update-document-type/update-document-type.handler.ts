import { DocumentTypeRepository } from '@/modules/profile/domain/repositories/document-type.repository';
import { UpdateDocumentTypeCommand } from './update-document-type.command';
import { DocumentType } from '@/modules/profile/domain/entities/document-type';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

@CommandHandler(UpdateDocumentTypeCommand)
export class UpdateDocumentTypeHandler implements ICommandHandler<UpdateDocumentTypeCommand> {
  constructor(private readonly repository: DocumentTypeRepository) {}

  async execute(command: UpdateDocumentTypeCommand): Promise<void> {
    const documentType = DocumentType.create({ ...command.document_type_dto });
    await this.repository.update(documentType);
  }
}
