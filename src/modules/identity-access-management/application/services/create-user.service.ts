import { User } from '../../domain/entities/user';
import { UserDto } from '../dtos/user.dto';
import { CreateUserCommand } from '../user/commands/create-user/create-user.command';
import { CreateUserHandler } from '../user/commands/create-user/create-user.handler';
export class CreateUserService {
  constructor(private readonly createUser: CreateUserHandler) {}
  async run(user_dto: UserDto): Promise<User> {
    const user = new CreateUserCommand(user_dto);
    return await this.createUser.execute(user);
  }
}
