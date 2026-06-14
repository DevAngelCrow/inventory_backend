import { CreatePersonHandler } from '../../application/person/commands/create-person/create-person.handler';
import { UpdatePersonHandler } from '../../application/person/commands/update-person/update-person.handler';
import { DeletePersonHandler } from '../../application/person/commands/delete-person/delete-person.handler';
import { CreateDocumentHandler } from '../../application/document/commands/create-document/create-document.handler';
import { UpdateDocumentHandler } from '../../application/document/commands/update-document/update-document.handler';
import { DeleteDocumentHandler } from '../../application/document/commands/delete-document/delete-document.handler';
import { CreateAddressHandler } from '../../application/address/commands/create-address/create-address.handler';
import { UpdateAddressHandler } from '../../application/address/commands/update-address/update-address.handler';
import { DeleteAddressHandler } from '../../application/address/commands/delete-address/delete-address.handler';
import { CreateDocumentTypeHandler } from '../../application/document-type/commands/create-document-type/create-document-type.handler';
import { UpdateDocumentTypeHandler } from '../../application/document-type/commands/update-document-type/update-document-type.handler';
import { DeleteDocumentTypeHandler } from '../../application/document-type/commands/delete-document-type/delete-document-type.handler';

export const commandHandlerProviders = [
  CreatePersonHandler,
  UpdatePersonHandler,
  DeletePersonHandler,
  CreateDocumentHandler,
  UpdateDocumentHandler,
  DeleteDocumentHandler,
  CreateAddressHandler,
  UpdateAddressHandler,
  DeleteAddressHandler,
  CreateDocumentTypeHandler,
  UpdateDocumentTypeHandler,
  DeleteDocumentTypeHandler,
];
