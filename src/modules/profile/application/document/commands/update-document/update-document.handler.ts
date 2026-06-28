import { PersonRepository } from '@/modules/profile/domain/repositories/person.repository';
import { UpdateDocumentCommand } from './update-document.command';
import { Document } from '@/modules/profile/domain/entities/document';
import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { NotFoundException } from '@/shared/domain/exceptions/not-found.exception';
import { PersonId } from '@/modules/profile/domain/value-objects/person-value-object/person-id';
import { DocumentId } from '@/modules/profile/domain/value-objects/document-value-object/document-id';
import { DocumentNumberDoc } from '@/modules/profile/domain/value-objects/document-value-object/document-number-doc';
import { DocumentDescription } from '@/modules/profile/domain/value-objects/document-value-object/document-description';
import { DocumentIdPerson } from '@/modules/profile/domain/value-objects/document-value-object/document-id-people';
import { DocumentIdTypeDocument } from '@/modules/profile/domain/value-objects/document-value-object/document-id-type-document';
import { DocumentActive } from '@/modules/profile/domain/value-objects/document-value-object/document-active';

@CommandHandler(UpdateDocumentCommand)
export class UpdateDocumentHandler implements ICommandHandler<UpdateDocumentCommand> {
  constructor(
    private readonly repository: PersonRepository,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: UpdateDocumentCommand): Promise<void> {
    const personId = new PersonId(command.document_dto.id_people);
    const personEntity = await this.repository.findById(personId);
    
    if (!personEntity) {
      throw new NotFoundException('Person', command.document_dto.id_people);
    }

    const person = this.publisher.mergeObjectContext(personEntity);
    const document = Document.create({
      id: command.document_dto.id ? new DocumentId(command.document_dto.id) : null,
      number_document: new DocumentNumberDoc(command.document_dto.number_document),
      description: command.document_dto.description ? new DocumentDescription(command.document_dto.description) : undefined,
      id_people: new DocumentIdPerson(command.document_dto.id_people),
      id_type_document: new DocumentIdTypeDocument(command.document_dto.id_type_document),
      active: new DocumentActive(command.document_dto.active),
    });
    if (!command.document_dto.id) {
      throw new Error('Document ID is required for update');
    }
    person.updateDocument(command.document_dto.id, document);

    await this.repository.update(person);
    person.commit();
  }
}
