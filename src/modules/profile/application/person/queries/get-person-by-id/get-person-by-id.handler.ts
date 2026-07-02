import { PersonId } from '@/modules/profile/domain/value-objects/person-value-object/person-id';
import { GetPersonByIdQuery } from './get-person-by-id.query';
import { PersonRepository } from '@/modules/profile/domain/repositories/person.repository';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

@QueryHandler(GetPersonByIdQuery)
export class GetPersonByIdHandler implements IQueryHandler<GetPersonByIdQuery> {
  constructor(private readonly repository: PersonRepository) {}
  async execute(query: GetPersonByIdQuery) {
    const person = await this.repository.findById(new PersonId(query.id));
    return person;
  }
}
