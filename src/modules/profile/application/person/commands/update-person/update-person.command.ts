import { PersonDto } from '../../../dtos/person.dto';

export class UpdatePersonCommand {
  constructor(public readonly person_dto: PersonDto) {}
}
