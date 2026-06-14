import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { UserDto } from '../../../dtos/user.dto';
import { UserReadRepository } from '../../../repositories/user-read.repository';
import { GetUserByEmailQuery } from './get-user-by-email.query';

@QueryHandler(GetUserByEmailQuery)
export class GetUserByEmailHandler implements IQueryHandler<GetUserByEmailQuery> {
  constructor(private readonly userRepository: UserReadRepository) {}
  async execute(query: GetUserByEmailQuery): Promise<UserDto | null> {
    return await this.userRepository.getOneUserByEmail(query.email);
  }
}
