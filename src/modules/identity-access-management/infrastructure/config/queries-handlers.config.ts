import { GetUserByIdHandler } from '../../application/user/queries/get-user-by-id/get-user-by-id.handler';
import { GetUserByUserNameHandler } from '../../application/user/queries/get-user-by-user-name/get-user-by-user-name.handler';
import { GetUsersHandler } from '../../application/user/queries/get-users/get-users.handler';
import { GetUserAuthByNameHandler } from '../../application/user/queries/get-user-auth-by-name/get-user-auth-by-name.handler';
import { GetUserByEmailHandler } from '../../application/user/queries/get-user-by-email/get-user-by-email.handler';

export const queryHandlerProviders = [
  GetUserByIdHandler,
  GetUserByUserNameHandler,
  GetUsersHandler,
  GetUserAuthByNameHandler,
  GetUserByEmailHandler,
];
