import { Abstract, Type } from '@nestjs/common';
import { registerService } from '@/shared/infrastructure/factories/register-service.factory';
import { CreateUserService } from '../../application/services/create-user.service';
import { FindUserAuthByNameService } from '../../application/services/find-user-auth-by-user-name.service';
import { FindUserByIdService } from '../../application/services/find-user-by-id.service';
import { FindUserService } from '../../application/services/find-user.service';
import { CreateUserHandler } from '../../application/user/commands/create-user/create-user.handler';
import { GetUserByIdHandler } from '../../application/user/queries/get-user-by-id/get-user-by-id.handler';
import { GetUserByUserNameHandler } from '../../application/user/queries/get-user-by-user-name/get-user-by-user-name.handler';
import { GetUserAuthByNameHandler } from '../../application/user/queries/get-user-auth-by-name/get-user-auth-by-name.handler';
import { GetUserByEmailService } from '../../application/services/get-user-by-email.service';
import { GetUserByEmailHandler } from '../../application/user/queries/get-user-by-email/get-user-by-email.handler';
import { ResetPasswordUserService } from '../../application/services/reset-password-user.service';
import { ResetPasswordUserHandler } from '../../application/user/commands/reset-password-user/reset-password-user.handler';

export const services: Array<{
  service: Type<unknown>;
  deps: Array<Type<unknown> | Abstract<unknown>>;
}> = [
  {
    service: FindUserService,
    deps: [GetUserByUserNameHandler],
  },
  {
    service: CreateUserService,
    deps: [CreateUserHandler],
  },
  {
    service: FindUserAuthByNameService,
    deps: [GetUserAuthByNameHandler],
  },
  {
    service: FindUserByIdService,
    deps: [GetUserByIdHandler],
  },
  {
    service: GetUserByEmailService,
    deps: [GetUserByEmailHandler],
  },
  {
    service: ResetPasswordUserService,
    deps: [ResetPasswordUserHandler],
  },
];
export const serviceProviders = services.map((uc) => {
  return registerService(uc.service, uc.deps);
});
