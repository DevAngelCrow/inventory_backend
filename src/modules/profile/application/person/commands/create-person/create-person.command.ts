import { PersonDto } from '../../../dtos/person.dto';

export class CreatePersonCommand {
  constructor(public readonly person_dto: PersonDto) {}
}
