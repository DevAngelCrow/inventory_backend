import { Person } from '@/modules/profile/domain/entities/person';
import { GetPersonByEmailHandler } from '../../person/queries/get-person-by-email/get-person-by-email.handler';
import { GetPersonByEmailQuery } from '../../person/queries/get-person-by-email/get-person-by-email.query';
export class PersonGetOneByEmailService {
  constructor(private readonly personGetOneByEmail: GetPersonByEmailHandler) {}
  async run(email: string): Promise<Person | null> {
    const personQuery = new GetPersonByEmailQuery(email);
    return await this.personGetOneByEmail.execute(personQuery);
  }
}
