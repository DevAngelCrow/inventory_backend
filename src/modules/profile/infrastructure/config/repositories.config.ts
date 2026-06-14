import { AddressRepository } from '../../domain/repositories/address.repository';
import { DocumentTypeRepository } from '../../domain/repositories/document-type.repository';
import { DocumentRepository } from '../../domain/repositories/document.repository';
import { PersonRepository } from '../../domain/repositories/person.repository';
import { ImplAddressRepository } from '../implementation/impl-address.repository';
import { ImplDocumentTypeRepository } from '../implementation/impl-document-type.repository';
import { ImplDocumentRepository } from '../implementation/impl-document.repository';
import { ImplPersonRepository } from '../implementation/impl-person.repository';
import { PersonReadRepository } from '../../application/repositories/person-read.repository';
import { DocumentTypeReadRepository } from '../../application/repositories/document-type-read.repository';
import { DocumentReadRepository } from '../../application/repositories/document-read.repository';
import { AddressReadRepository } from '../../application/repositories/address-read.repository';

export const repositories = [
  { provide: PersonRepository, useClass: ImplPersonRepository },
  { provide: DocumentTypeRepository, useClass: ImplDocumentTypeRepository },
  { provide: DocumentRepository, useClass: ImplDocumentRepository },
  { provide: AddressRepository, useClass: ImplAddressRepository },
  { provide: PersonReadRepository, useClass: ImplPersonRepository },
  { provide: DocumentTypeReadRepository, useClass: ImplDocumentTypeRepository },
  { provide: DocumentReadRepository, useClass: ImplDocumentRepository },
  { provide: AddressReadRepository, useClass: ImplAddressRepository },
];
