import { PersonRepository } from '@/modules/profile/domain/repositories/person.repository';
import { DeleteAddressCommand } from './delete-address.command';
import { AddressId } from '@/modules/profile/domain/value-objects/address-value-object/address-id';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EventDispatcherPort } from '@/shared/domain/ports/event-dispatcher.port';
import { NotFoundException } from '@/shared/domain/exceptions/not-found.exception';
import { PrismaService } from '@/shared/infrastructure/persistence/prisma/prisma.service';
import { PersonId } from '@/modules/profile/domain/value-objects/person-value-object/person-id';

@CommandHandler(DeleteAddressCommand)
export class DeleteAddressHandler implements ICommandHandler<DeleteAddressCommand> {
  constructor(
    private readonly repository: PersonRepository,
    private readonly dispatcher: EventDispatcherPort,
    private readonly prisma: PrismaService,
  ) {}

  async execute(command: DeleteAddressCommand): Promise<void> {
    const addressDb = await this.prisma.client.mnt_address.findUnique({
      where: { id: command.id },
    });

    if (!addressDb) {
      throw new NotFoundException('Address', command.id);
    }

    const personId = new PersonId(addressDb.id_people);
    const personEntity = await this.repository.findById(personId);

    if (!personEntity) {
      throw new NotFoundException('Person', addressDb.id_people);
    }

    personEntity.removeAddress(command.id);

    await this.repository.update(personEntity);
    await this.dispatcher.dispatch(personEntity.getDomainEvents());
    personEntity.clearDomainEvents();
  }
}
