import { Abstract, Type } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TokenGeneratorService } from '../../application/services/token-generator.service';
import { CredentialsValidationService } from '../../application/services/credentials-validation.service';
import { FindUserService } from '../../../identity-access-management/application/services/find-user.service';
import { registerService } from '@/shared/infrastructure/factories/register-service.factory';
import { StorageUploadService } from '@/modules/storage/application/services/storage/storage-upload.service';
import { CreateUserService } from '@/modules/identity-access-management/application/services/create-user.service';
import { CreateUserRoleService } from '@/modules/security/application/services/user-role/create-user-role.service';
import { TokenDedecoderService } from '../../application/services/token-decoder.service';
import { CreateUserHandler } from '@/modules/identity-access-management/application/user/commands/create-user/create-user.handler';
import { AuthReadPort } from '../../application/ports/auth-read.port';
import { GetUserByUserNameHandler } from '@/modules/identity-access-management/application/user/queries/get-user-by-user-name/get-user-by-user-name.handler';
import { JwtRefreshStrategy } from '../strategies/jwt-refresh.strategy';
import { UserReadRepository } from '@/modules/identity-access-management/application/repositories/user-read.repository';
import { JwtStrategy } from '../strategies/jwt.strategy';
import { CreateUserRoleHandler } from '@/modules/security/application/user-rol/commands/create-user-role/create-user-role.handler';
import { StorageFilesUploadFlowHandler } from '@/modules/storage/application/storage-files/commands/storage-files-upload-flow/storage-files-upload-flow.handler';
import { PersonUpdateService } from '@/modules/profile/application/services/person/person-update.service';
import { UpdatePersonHandler } from '@/modules/profile/application/person/commands/update-person/update-person.handler';
import { AddressUpdateService } from '@/modules/profile/application/services/address/address-update.service';
import { UpdateAddressHandler } from '@/modules/profile/application/address/commands/update-address/update-address.handler';
import { DocumentUpdateService } from '@/modules/profile/application/services/document/document-update.service';
import { UpdateDocumentHandler } from '@/modules/profile/application/document/commands/update-document/update-document.handler';
import { UpdateUserNameService } from '@/modules/identity-access-management/application/services/update-user-name.service';
import { UpdateNameUserHandler } from '@/modules/identity-access-management/application/user/commands/update-name-user/update-name-user.handler';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

export const services: Array<{
  service: Type<unknown>;
  deps: Array<Type<unknown> | Abstract<unknown> | string>;
}> = [
  {
    service: TokenGeneratorService,
    deps: [AuthReadPort],
  },
  {
    service: CredentialsValidationService,
    deps: [AuthReadPort],
  },
  {
    service: FindUserService,
    deps: [GetUserByUserNameHandler],
  },
  {
    service: StorageUploadService,
    deps: [StorageFilesUploadFlowHandler],
  },
  {
    service: CreateUserService,
    deps: [CreateUserHandler],
  },
  {
    service: CreateUserRoleService,
    deps: [CreateUserRoleHandler],
  },
  {
    service: TokenDedecoderService,
    deps: [AuthReadPort],
  },
  {
    service: JwtRefreshStrategy,
    deps: [UserReadRepository, ConfigService],
  },
  {
    service: JwtStrategy,
    deps: [UserReadRepository, CACHE_MANAGER, ConfigService],
  },
  {
    service: PersonUpdateService,
    deps: [UpdatePersonHandler],
  },
  {
    service: AddressUpdateService,
    deps: [UpdateAddressHandler],
  },
  {
    service: DocumentUpdateService,
    deps: [UpdateDocumentHandler],
  },
  {
    service: UpdateUserNameService,
    deps: [UpdateNameUserHandler],
  },
];

export const serviceProviders = services.map((uc) => {
  return registerService(uc.service, uc.deps);
});
