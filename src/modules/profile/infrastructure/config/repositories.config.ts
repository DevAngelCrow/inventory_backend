import { DocumentTypeRepository } from '../../domain/repositories/document-type.repository';
import { PersonRepository } from '../../domain/repositories/person.repository';
import { ImplDocumentTypeRepository } from '../implementation/impl-document-type.repository';
import { ImplPersonRepository } from '../implementation/impl-person.repository';
import { PersonReadRepository } from '../../application/repositories/person-read.repository';
import { DocumentTypeReadRepository } from '../../application/repositories/document-type-read.repository';
import { DocumentReadRepository } from '../../application/repositories/document-read.repository';
import { AddressReadRepository } from '../../application/repositories/address-read.repository';
import { ImplAddressReadRepository } from '../implementation/impl-address-read.repository';
import { ImplDocumentReadRepository } from '../implementation/impl-document-read.repository';

export const repositories = [
  { provide: PersonRepository, useClass: ImplPersonRepository },
  { provide: DocumentTypeRepository, useClass: ImplDocumentTypeRepository },
  { provide: PersonReadRepository, useClass: ImplPersonRepository },
  { provide: DocumentTypeReadRepository, useClass: ImplDocumentTypeRepository },
  { provide: DocumentReadRepository, useClass: ImplDocumentReadRepository },
  { provide: AddressReadRepository, useClass: ImplAddressReadRepository },
];
