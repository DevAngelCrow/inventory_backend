import { GetPersonByEmailQuery } from './get-person-by-email.query';
import { PersonReadRepository } from '../../../repositories/person-read.repository';
import { PersonEmail } from '@/modules/profile/domain/value-objects/person-value-object/person-email';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

@QueryHandler(GetPersonByEmailQuery)
export class GetPersonByEmailHandler implements IQueryHandler<GetPersonByEmailQuery> {
  constructor(private readonly repository: PersonReadRepository) {}
  async execute(query: GetPersonByEmailQuery) {
    return await this.repository.getOneByEmail(new PersonEmail(query.email));
  }
}
