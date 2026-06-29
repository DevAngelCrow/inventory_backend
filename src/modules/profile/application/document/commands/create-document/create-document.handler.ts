import { PersonRepository } from '@/modules/profile/domain/repositories/person.repository';
import { CreateDocumentCommand } from './create-document.command';
import { Document } from '@/modules/profile/domain/entities/document';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EventDispatcherPort } from '@/shared/domain/ports/event-dispatcher.port';
import { NotFoundException } from '@/shared/domain/exceptions/not-found.exception';
import { PersonId } from '@/modules/profile/domain/value-objects/person-value-object/person-id';
import { DocumentNumberDoc } from '@/modules/profile/domain/value-objects/document-value-object/document-number-doc';
import { DocumentDescription } from '@/modules/profile/domain/value-objects/document-value-object/document-description';
import { DocumentIdPerson } from '@/modules/profile/domain/value-objects/document-value-object/document-id-people';
import { DocumentIdTypeDocument } from '@/modules/profile/domain/value-objects/document-value-object/document-id-type-document';
import { DocumentActive } from '@/modules/profile/domain/value-objects/document-value-object/document-active';

@CommandHandler(CreateDocumentCommand)
export class CreateDocumentHandler implements ICommandHandler<CreateDocumentCommand> {
  constructor(
    private readonly repository: PersonRepository,
    private readonly dispatcher: EventDispatcherPort,
  ) {}

  async execute(command: CreateDocumentCommand): Promise<void> {
    const personId = new PersonId(command.document_dto.id_people);
    const personEntity = await this.repository.findById(personId);

    if (!personEntity) {
      throw new NotFoundException('Person', command.document_dto.id_people);
    }

    const document = Document.create({
      number_document: new DocumentNumberDoc(
        command.document_dto.number_document,
      ),
      description: command.document_dto.description
        ? new DocumentDescription(command.document_dto.description)
        : undefined,
      id_people: new DocumentIdPerson(command.document_dto.id_people),
      id_type_document: new DocumentIdTypeDocument(
        command.document_dto.id_type_document,
      ),
      active: new DocumentActive(command.document_dto.active),
    });
    personEntity.addDocument(document);

    await this.repository.update(personEntity);
    await this.dispatcher.dispatch(personEntity.getDomainEvents());
    personEntity.clearDomainEvents();
  }
}
