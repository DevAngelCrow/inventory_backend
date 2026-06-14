import { UserAuthDto } from '../dtos/user-auth.dto';
import { GetUserAuthByNameHandler } from '../user/queries/get-user-auth-by-name/get-user-auth-by-name.handler';
import { GetUserAuthByNameQuery } from '../user/queries/get-user-auth-by-name/get-user-auth-by-name.query';
export class FindUserAuthByNameService {
  constructor(private readonly findUserByName: GetUserAuthByNameHandler) {}
  async run(user_name: string): Promise<UserAuthDto | null> {
    const query = new GetUserAuthByNameQuery(user_name);
    const result = await this.findUserByName.execute(query);
    return result;
  }
}
