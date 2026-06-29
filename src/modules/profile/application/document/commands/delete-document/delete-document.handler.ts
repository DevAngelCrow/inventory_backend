import { PersonRepository } from '@/modules/profile/domain/repositories/person.repository';
import { DeleteDocumentCommand } from './delete-document.command';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EventDispatcherPort } from '@/shared/domain/ports/event-dispatcher.port';
import { NotFoundException } from '@/shared/domain/exceptions/not-found.exception';
import { PrismaService } from '@/shared/infrastructure/persistence/prisma/prisma.service';
import { PersonId } from '@/modules/profile/domain/value-objects/person-value-object/person-id';

@CommandHandler(DeleteDocumentCommand)
export class DeleteDocumentHandler implements ICommandHandler<DeleteDocumentCommand> {
  constructor(
    private readonly repository: PersonRepository,
    private readonly dispatcher: EventDispatcherPort,
    private readonly prisma: PrismaService,
  ) {}

  async execute(command: DeleteDocumentCommand): Promise<void> {
    const documentDb = await this.prisma.client.mnt_document.findUnique({
      where: { id: command.id },
    });

    if (!documentDb) {
      throw new NotFoundException('Document', command.id);
    }

    const personId = new PersonId(documentDb.id_people);
    const personEntity = await this.repository.findById(personId);

    if (!personEntity) {
      throw new NotFoundException('Person', documentDb.id_people);
    }

    personEntity.removeDocument(command.id);

    await this.repository.update(personEntity);
    await this.dispatcher.dispatch(personEntity.getDomainEvents());
    personEntity.clearDomainEvents();
  }
}
