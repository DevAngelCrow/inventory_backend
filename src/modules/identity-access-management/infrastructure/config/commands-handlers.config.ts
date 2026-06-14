import { CreateUserHandler } from '../../application/user/commands/create-user/create-user.handler';
import { UpdateNameUserHandler } from '../../application/user/commands/update-name-user/update-name-user.handler';
import { ResetPasswordUserHandler } from '../../application/user/commands/reset-password-user/reset-password-user.handler';

export const commandHandlerProviders = [
  CreateUserHandler,
  UpdateNameUserHandler,
  ResetPasswordUserHandler,
];
