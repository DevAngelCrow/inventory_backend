import { Person } from '@/modules/profile/domain/entities/person';
import { PersonDto } from '../../dtos/person.dto';
import { CreatePersonHandler } from '../../person/commands/create-person/create-person.handler';
import { CreatePersonCommand } from '../../person/commands/create-person/create-person.command';
export class PersonCreateService {
  constructor(private readonly personCreate: CreatePersonHandler) {}
  async run(person_dto: PersonDto): Promise<Person | void> {
    const personCommand = new CreatePersonCommand(person_dto);
    return await this.personCreate.execute(personCommand);
  }
}
