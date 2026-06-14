import { Abstract, Type } from '@nestjs/common';
import { AddressCreateService } from '../../application/services/address/address-create.service';
import { DocumentCreateService } from '../../application/services/document/document-create.service';
//import { DocumentCreate } from '../../application/use-cases/document/document-create';
//import { AddressCreate } from '../../application/use-cases/address/address-create';
import { PersonCreateService } from '../../application/services/person/person-create.service';
//import { PersonCreate } from '../../application/use-cases/person/person-create';
import { registerService } from '@/shared/infrastructure/factories/register-service.factory';
import { PersonGetOneByEmailService } from '../../application/services/person/person-get-one-by-email.service';
//import { PersonGetOneByEmail } from '../../application/use-cases/person/person-get-one-by-email';
import { GetDocumentTypesService } from '../../application/services/document-type/get-document-types.service';
import { GetDocumentTypesHandler } from '../../application/document-type/queries/get-document-types/get-document-types.handler';
import { CreateAddressHandler } from '../../application/address/commands/create-address/create-address.handler';
import { CreateDocumentHandler } from '../../application/document/commands/create-document/create-document.handler';
import { CreatePersonHandler } from '../../application/person/commands/create-person/create-person.handler';
import { GetPersonByEmailHandler } from '../../application/person/queries/get-person-by-email/get-person-by-email.handler';

export const services: Array<{
  service: Type<unknown>;
  deps: Array<Type<unknown> | Abstract<unknown>>;
}> = [
  {
    service: AddressCreateService,
    deps: [CreateAddressHandler],
  },
  {
    service: DocumentCreateService,
    deps: [CreateDocumentHandler],
  },
  {
    service: PersonCreateService,
    deps: [CreatePersonHandler],
  },
  {
    service: PersonGetOneByEmailService,
    deps: [GetPersonByEmailHandler],
  },
  {
    service: GetDocumentTypesService,
    deps: [GetDocumentTypesHandler],
  },
];

export const serviceProviders = services.map((uc) => {
  return registerService(uc.service, uc.deps);
});
