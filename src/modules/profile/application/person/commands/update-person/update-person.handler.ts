import { PersonRepository } from '@/modules/profile/domain/repositories/person.repository';
import { UpdatePersonCommand } from './update-person.command';
import { Person } from '@/modules/profile/domain/entities/person';
import { PersonId } from '@/modules/profile/domain/value-objects/person-value-object/person-id';
import { NotFoundException } from '@/shared/domain/exceptions/not-found.exception';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

@CommandHandler(UpdatePersonCommand)
export class UpdatePersonHandler implements ICommandHandler<UpdatePersonCommand> {
  constructor(private readonly repository: PersonRepository) {}

  async execute(command: UpdatePersonCommand): Promise<void> {
    const currentPerson = await this.repository.getOneById(
      new PersonId(command.person_dto.id!),
    );
    if (!currentPerson) {
      throw new NotFoundException('Person', command.person_dto.id ?? 'unknown');
    }

    const person = Person.create({
      id: command.person_dto.id,
      first_name: command.person_dto.first_name,
      birthdate: command.person_dto.birthdate,
      id_gender: command.person_dto.id_gender,
      email: command.person_dto.email || currentPerson.getEmail().value(),
      id_marital_status: command.person_dto.id_marital_status,
      phone: command.person_dto.phone,
      id_status:
        command.person_dto.id_status || currentPerson.getIdStatus().value(),
      middle_name: command.person_dto.middle_name,
      last_name: command.person_dto.last_name,
      img_path: command.person_dto.img_path,
    });
    const nationalities = command.person_dto.nationalities;
    await this.repository.update(person, nationalities);
  }
}
