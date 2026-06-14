import { GetPeopleHandler } from '../../application/person/queries/get-people/get-people.handler';
import { GetPersonByIdHandler } from '../../application/person/queries/get-person-by-id/get-person-by-id.handler';
import { GetPersonByEmailHandler } from '../../application/person/queries/get-person-by-email/get-person-by-email.handler';
import { GetDocumentsHandler } from '../../application/document/queries/get-documents/get-documents.handler';
import { GetDocumentByIdHandler } from '../../application/document/queries/get-document-by-id/get-document-by-id.handler';
import { GetAddressesHandler } from '../../application/address/queries/get-addresses/get-addresses.handler';
import { GetAddressByIdHandler } from '../../application/address/queries/get-address-by-id/get-address-by-id.handler';
import { GetDocumentTypesHandler } from '../../application/document-type/queries/get-document-types/get-document-types.handler';
import { GetDocumentTypeByIdHandler } from '../../application/document-type/queries/get-document-type-by-id/get-document-type-by-id.handler';
import { GetProfileByIdPersonHandler } from '../../application/person/queries/get-profile-by-id-person/get-profile-by-id-person.handler';

export const queryHandlerProviders = [
  GetPeopleHandler,
  GetPersonByIdHandler,
  GetPersonByEmailHandler,
  GetDocumentsHandler,
  GetDocumentByIdHandler,
  GetAddressesHandler,
  GetAddressByIdHandler,
  GetDocumentTypesHandler,
  GetDocumentTypeByIdHandler,
  GetProfileByIdPersonHandler,
];
