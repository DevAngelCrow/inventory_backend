import { PersonReadRepository } from '../../../repositories/person-read.repository';
import { GetProfileByIdPersonQuery } from './get-profile-by-id-person.query';
import { AuthenticateProfileDto } from '@/modules/auth/application/dtos/authenticate-profile.dto';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

@QueryHandler(GetProfileByIdPersonQuery)
export class GetProfileByIdPersonHandler implements IQueryHandler<GetProfileByIdPersonQuery> {
  constructor(
    private readonly repository: PersonReadRepository,
  ) {}
  async execute(query: GetProfileByIdPersonQuery) {
    const dto = await this.repository.getOneByIdProfile(query.id);
    if (!dto) return null;
    return AuthenticateProfileDto.fromDto(dto);
  }
}
