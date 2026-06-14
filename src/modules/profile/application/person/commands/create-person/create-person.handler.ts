import { PersonRepository } from '@/modules/profile/domain/repositories/person.repository';
import { CreatePersonCommand } from './create-person.command';
import { Person } from '@/modules/profile/domain/entities/person';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

@CommandHandler(CreatePersonCommand)
export class CreatePersonHandler implements ICommandHandler<CreatePersonCommand> {
  constructor(private readonly repository: PersonRepository) {}

  async execute(command: CreatePersonCommand): Promise<Person | void> {
    const person = Person.create({
      first_name: command.person_dto.first_name,
      birthdate: command.person_dto.birthdate,
      id_gender: command.person_dto.id_gender,
      email: command.person_dto.email,
      id_marital_status: command.person_dto.id_marital_status,
      phone: command.person_dto.phone,
      id_status: command.person_dto.id_status,
      middle_name: command.person_dto.middle_name,
      last_name: command.person_dto.last_name,
      img_path: command.person_dto.img_path,
    });
    const nationalities = command.person_dto.nationalities;
    return await this.repository.create(person, nationalities);
  }
}
