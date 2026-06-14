import { DocumentTypeRepository } from '@/modules/profile/domain/repositories/document-type.repository';
import { CreateDocumentTypeCommand } from './create-document-type.command';
import { DocumentType } from '@/modules/profile/domain/entities/document-type';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

@CommandHandler(CreateDocumentTypeCommand)
export class CreateDocumentTypeHandler implements ICommandHandler<CreateDocumentTypeCommand> {
  constructor(private readonly repository: DocumentTypeRepository) {}

  async execute(command: CreateDocumentTypeCommand): Promise<void> {
    const documentType = DocumentType.create({ ...command.document_type_dto });
    return await this.repository.create(documentType);
  }
}
