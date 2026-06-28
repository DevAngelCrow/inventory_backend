import { PersonRepository } from '@/modules/profile/domain/repositories/person.repository';
import { CreatePersonCommand } from './create-person.command';
import { Person } from '@/modules/profile/domain/entities/person';
import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
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

@CommandHandler(CreatePersonCommand)
export class CreatePersonHandler implements ICommandHandler<CreatePersonCommand> {
  constructor(
    private readonly repository: PersonRepository,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: CreatePersonCommand): Promise<Person | void> {
    const personEntity = Person.create({
      first_name: command.person_dto.first_name ? new PersonFirstName(command.person_dto.first_name) : null,
      birthdate: command.person_dto.birthdate ? new PersonBirthdate(command.person_dto.birthdate) : null,
      id_gender: command.person_dto.id_gender ? new PersonIdGender(command.person_dto.id_gender) : null,
      email: new PersonEmail(command.person_dto.email),
      id_marital_status: command.person_dto.id_marital_status ? new PersonIdMaritalStatus(command.person_dto.id_marital_status) : null,
      phone: command.person_dto.phone ? new PersonPhone(command.person_dto.phone) : null,
      id_status: new PersonIdStatus(command.person_dto.id_status),
      middle_name: command.person_dto.middle_name ? new PersonMiddleName(command.person_dto.middle_name) : null,
      last_name: command.person_dto.last_name ? new PersonLastName(command.person_dto.last_name) : null,
      img_path: command.person_dto.img_path ? new PersonImgPath(command.person_dto.img_path) : null,
    });
    const person = this.publisher.mergeObjectContext(personEntity);
    person.created();
    const nationalities = command.person_dto.nationalities;
    const result = await this.repository.create(person, nationalities);
    person.commit();
    return result;
  }
}
