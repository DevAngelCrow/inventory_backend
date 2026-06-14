import { UserDto } from '../../../dtos/user.dto';

export class CreateUserCommand {
  constructor(public readonly user_dto: UserDto) {}
}
