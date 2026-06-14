import { Person } from '@/modules/profile/domain/entities/person';
import { PersonDto } from '../../dtos/person.dto';
import { CreatePersonCommand } from '../../person/commands/create-person/create-person.command';
import { UpdatePersonHandler } from '../../person/commands/update-person/update-person.handler';
export class PersonUpdateService {
  constructor(private readonly personUpdate: UpdatePersonHandler) {}
  async run(person_dto: PersonDto): Promise<Person | void> {
    const personCommand = new CreatePersonCommand(person_dto);
    return await this.personUpdate.execute(personCommand);
  }
}
