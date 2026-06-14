import { Abstract, Type } from '@nestjs/common';
import { CreateUserRoleService } from '../../application/services/user-role/create-user-role.service';
import { registerService } from '@/shared/infrastructure/factories/register-service.factory';
import { TokenDedecoderService } from '@/modules/auth/application/services/token-decoder.service';
import { GetRoleByCodeService } from '../../application/services/user-role/get-rol-by-code.service';
import { GetRolByCodeHandler } from '../../application/rol/queries/get-rol-by-code/get-rol-by-code.handler';
import { UpdateOrCreateUserRoleService } from '../../application/services/user-role/update-or-create-user-role.service';
import { UpdateUserRoleByIdHandler } from '../../application/user-rol/commands/update-user-role-by-id/update-user-role-by-id.handler';
import { AuthReadPort } from '@/modules/auth/application/ports/auth-read.port';
import { CreateUserRoleHandler } from '../../application/user-rol/commands/create-user-role/create-user-role.handler';

export const services: Array<{
  service: Type<unknown>;
  deps: Array<Type<unknown> | Abstract<unknown>>;
}> = [
  {
    service: CreateUserRoleService,
    deps: [CreateUserRoleHandler],
  },
  {
    service: TokenDedecoderService,
    deps: [AuthReadPort],
  },
  {
    service: GetRoleByCodeService,
    deps: [GetRolByCodeHandler],
  },
  {
    service: UpdateOrCreateUserRoleService,
    deps: [UpdateUserRoleByIdHandler],
  },
];
export const serviceProviders = services.map((uc) => {
  return registerService(uc.service, uc.deps);
});
