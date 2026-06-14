import { ResetPasswordUserCommand } from '../user/commands/reset-password-user/reset-password-user.command';
import { ResetPasswordUserHandler } from '../user/commands/reset-password-user/reset-password-user.handler';

export class ResetPasswordUserService {
  constructor(private readonly resetPasswordUser: ResetPasswordUserHandler) {}
  async run(id_user: string, password: string, token: string): Promise<void> {
    const data = new ResetPasswordUserCommand(id_user, password, token);
    return await this.resetPasswordUser.execute(data);
  }
}
