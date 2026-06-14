import { DocumentTypeRepository } from '@/modules/profile/domain/repositories/document-type.repository';
import { DeleteDocumentTypeCommand } from './delete-document-type.command';
import { DocumentTypeId } from '@/modules/profile/domain/value-objects/document-type-value-object/document-type-id';
import { DocumentTypeDto } from '../../../dtos/document-type.dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

@CommandHandler(DeleteDocumentTypeCommand)
export class DeleteDocumentTypeHandler implements ICommandHandler<DeleteDocumentTypeCommand> {
  constructor(private readonly repository: DocumentTypeRepository) {}

  async execute(command: DeleteDocumentTypeCommand): Promise<DocumentTypeDto> {
    const documentTypeEntity = await this.repository.toggleStatus(
      new DocumentTypeId(command.id),
    );
    const documentTypeDto = DocumentTypeDto.fromEntity(documentTypeEntity);
    return documentTypeDto;
  }
}
