import { PersonRepository } from '@/modules/profile/domain/repositories/person.repository';
import { UpdatePersonCommand } from './update-person.command';
import { Person } from '@/modules/profile/domain/entities/person';
import { PersonId } from '@/modules/profile/domain/value-objects/person-value-object/person-id';
import { NotFoundException } from '@/shared/domain/exceptions/not-found.exception';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EventDispatcherPort } from '@/shared/domain/ports/event-dispatcher.port';
import { PersonFirstName } from '@/modules/profile/domain/value-objects/person-value-object/person-first-name';
import { PersonBirthdate } from '@/modules/profile/domain/value-objects/person-value-object/person-birthdate';
import { PersonIdGender } from '@/modules/profile/domain/value-objects/person-value-object/person-id-gender';
import { PersonEmail } from '@/modules/profile/domain/value-objects/person-value-object/person-email';
import { PersonIdMaritalStatus } from '@/modules/profile/domain/value-objects/person-value-object/person-id-marital-status';
import { PersonPhone } from '@/modules/profile/domain/value-objects/person-value-object/person-phone';
import { PersonIdStatus } from '@/modules/profile/domain/value-objects/person-value-object/person-id-status';
import { PersonMiddleName } from '@/modules/profile/domain/value-objects/person-value-object/person-middle-name';
import { PersonLastName } from '@/modules/profile/domain/value-objects/person-value-object/person-last-name';
import { PersonImgPath } from '@/modules/profile/domain/value-objects/person-value-object/person-img-path';

@CommandHandler(UpdatePersonCommand)
export class UpdatePersonHandler implements ICommandHandler<UpdatePersonCommand> {
  constructor(
    private readonly repository: PersonRepository,
    private readonly dispatcher: EventDispatcherPort,
  ) {}

  async execute(command: UpdatePersonCommand): Promise<void> {
    const currentPerson = await this.repository.findById(
      new PersonId(command.person_dto.id!),
    );
    if (!currentPerson) {
      throw new NotFoundException('Person', command.person_dto.id ?? 'unknown');
    }

    currentPerson.update({
      first_name: command.person_dto.first_name
        ? new PersonFirstName(command.person_dto.first_name)
        : null,
      birthdate: command.person_dto.birthdate
        ? new PersonBirthdate(command.person_dto.birthdate)
        : null,
      id_gender: command.person_dto.id_gender
        ? new PersonIdGender(command.person_dto.id_gender)
        : null,
      email: command.person_dto.email
        ? new PersonEmail(command.person_dto.email)
        : currentPerson.getEmail(),
      id_marital_status: command.person_dto.id_marital_status
        ? new PersonIdMaritalStatus(command.person_dto.id_marital_status)
        : null,
      phone: command.person_dto.phone
        ? new PersonPhone(command.person_dto.phone)
        : null,
      id_status: command.person_dto.id_status
        ? new PersonIdStatus(command.person_dto.id_status)
        : currentPerson.getIdStatus(),
      middle_name: command.person_dto.middle_name
        ? new PersonMiddleName(command.person_dto.middle_name)
        : null,
      last_name: command.person_dto.last_name
        ? new PersonLastName(command.person_dto.last_name)
        : null,
      img_path: command.person_dto.img_path
        ? new PersonImgPath(command.person_dto.img_path)
        : null,
    });
    const nationalities = command.person_dto.nationalities;
    await this.repository.update(currentPerson, nationalities);
    await this.dispatcher.dispatch(currentPerson.getDomainEvents());
    currentPerson.clearDomainEvents();
  }
}
