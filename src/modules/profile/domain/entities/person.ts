import { AggregateRoot } from '@/shared/domain/aggregate-root';
import { PersonBirthdate } from '../value-objects/person-value-object/person-birthdate';
import { PersonEmail } from '../value-objects/person-value-object/person-email';
import { PersonFirstName } from '../value-objects/person-value-object/person-first-name';
import { PersonId } from '../value-objects/person-value-object/person-id';
import { PersonIdGender } from '../value-objects/person-value-object/person-id-gender';
import { PersonIdMaritalStatus } from '../value-objects/person-value-object/person-id-marital-status';
import { PersonIdStatus } from '../value-objects/person-value-object/person-id-status';
import { PersonImgPath } from '../value-objects/person-value-object/person-img-path';
import { PersonLastName } from '../value-objects/person-value-object/person-last-name';
import { PersonMiddleName } from '../value-objects/person-value-object/person-middle-name';
import { PersonPhone } from '../value-objects/person-value-object/person-phone';
import { Address } from './address';
import { Document } from './document';
import { PersonCreatedEvent } from '../events/person-created.event';
import { PersonUpdatedEvent } from '../events/person-updated.event';
import { PersonAddressAddedEvent } from '../events/person-address-added.event';
import { PersonAddressUpdatedEvent } from '../events/person-address-updated.event';
import { PersonAddressRemovedEvent } from '../events/person-address-removed.event';
import { PersonDocumentAddedEvent } from '../events/person-document-added.event';
import { PersonDocumentUpdatedEvent } from '../events/person-document-updated.event';
import { PersonDocumentRemovedEvent } from '../events/person-document-removed.event';

export class Person extends AggregateRoot {
  private _addresses: Address[] = [];
  private _documents: Document[] = [];

  constructor(
    private first_name: PersonFirstName | null,
    private birthdate: PersonBirthdate | null,
    private id_gender: PersonIdGender | null,
    private email: PersonEmail,
    private id_marital_status: PersonIdMaritalStatus | null,
    private phone: PersonPhone | null,
    private id_status: PersonIdStatus,
    private last_name: PersonLastName | null,
    private img_path: PersonImgPath | null,
    private middle_name?: PersonMiddleName | null,
    private readonly id?: PersonId | null,
  ) {
    super();
  }

  static create(data: {
    id?: PersonId | null;
    first_name: PersonFirstName | null;
    birthdate: PersonBirthdate | null;
    id_gender: PersonIdGender | null;
    email: PersonEmail;
    id_marital_status: PersonIdMaritalStatus | null;
    phone: PersonPhone | null;
    id_status: PersonIdStatus;
    middle_name?: PersonMiddleName | null;
    last_name: PersonLastName | null;
    img_path: PersonImgPath | null;
  }): Person {
    return new Person(
      data.first_name,
      data.birthdate,
      data.id_gender,
      data.email,
      data.id_marital_status,
      data.phone,
      data.id_status,
      data.last_name,
      data.img_path,
      data.middle_name,
      data.id ?? null,
    );
  }

  created() {
    this.apply(
      new PersonCreatedEvent(
        this.id?.value(),
        this.first_name?.value() ?? null,
        this.birthdate?.value() ?? null,
        this.id_gender?.value() ?? null,
        this.email.value(),
        this.id_marital_status?.value() ?? null,
        this.phone?.value() ?? null,
        this.id_status.value(),
        this.last_name?.value() ?? null,
        this.img_path?.value() ?? null,
        this.middle_name?.value() ?? null,
      ),
    );
  }

  update(data: {
    first_name: PersonFirstName | null;
    birthdate: PersonBirthdate | null;
    id_gender: PersonIdGender | null;
    email: PersonEmail;
    id_marital_status: PersonIdMaritalStatus | null;
    phone: PersonPhone | null;
    id_status: PersonIdStatus;
    middle_name?: PersonMiddleName | null;
    last_name: PersonLastName | null;
    img_path: PersonImgPath | null;
  }) {
    this.first_name = data.first_name;
    this.birthdate = data.birthdate;
    this.id_gender = data.id_gender;
    this.email = data.email;
    this.id_marital_status = data.id_marital_status;
    this.phone = data.phone;
    this.id_status = data.id_status;
    this.last_name = data.last_name;
    this.img_path = data.img_path;
    this.middle_name = data.middle_name ?? null;

    this.apply(
      new PersonUpdatedEvent(
        this.first_name?.value() ?? null,
        this.birthdate?.value() ?? null,
        this.id_gender?.value() ?? null,
        this.email.value(),
        this.id_marital_status?.value() ?? null,
        this.phone?.value() ?? null,
        this.id_status.value(),
        this.last_name?.value() ?? null,
        this.img_path?.value() ?? null,
        this.middle_name?.value() ?? null,
      ),
    );
  }

  // Address Management
  getAddresses(): Address[] {
    return [...this._addresses];
  }

  setAddresses(addresses: Address[]) {
    this._addresses = addresses;
  }

  addAddress(address: Address) {
    this._addresses.push(address);
    this.apply(
      new PersonAddressAddedEvent(
        address.getStreet().value(),
        address.getStreetNumber().value(),
        address.getNeighborhood().value(),
        address.getHouseNumber().value(),
        address.getBlock().value(),
        address.getPathway().value(),
        address.getCurrent().value(),
        address.getIdPeople().value(),
        address.getIdGeographicDivision()?.value() ?? null,
      ),
    );
  }

  updateAddress(id: string, updatedAddress: Address) {
    const index = this._addresses.findIndex((a) => a.getId()?.value() === id);
    if (index !== -1) {
      this._addresses[index] = updatedAddress;
      this.apply(
        new PersonAddressUpdatedEvent(
          id,
          updatedAddress.getStreet().value(),
          updatedAddress.getStreetNumber().value(),
          updatedAddress.getNeighborhood().value(),
          updatedAddress.getHouseNumber().value(),
          updatedAddress.getBlock().value(),
          updatedAddress.getPathway().value(),
          updatedAddress.getCurrent().value(),
          updatedAddress.getIdPeople().value(),
          updatedAddress.getIdGeographicDivision()?.value() ?? null,
        ),
      );
    }
  }

  removeAddress(id: string) {
    this._addresses = this._addresses.filter((a) => a.getId()?.value() !== id);
    this.apply(new PersonAddressRemovedEvent(id));
  }

  // Document Management
  getDocuments(): Document[] {
    return [...this._documents];
  }

  setDocuments(documents: Document[]) {
    this._documents = documents;
  }

  addDocument(document: Document) {
    this._documents.push(document);
    this.apply(
      new PersonDocumentAddedEvent(
        document.getNumberDocument().value(),
        document.getIdPeople().value(),
        document.getIdTypeDocument().value(),
        document.getActive().value(),
        document.getDescription()?.value(),
      ),
    );
  }

  updateDocument(id: string, updatedDocument: Document) {
    const index = this._documents.findIndex((d) => d.getId()?.value() === id);
    if (index !== -1) {
      this._documents[index] = updatedDocument;
      this.apply(
        new PersonDocumentUpdatedEvent(
          id,
          updatedDocument.getNumberDocument().value(),
          updatedDocument.getIdPeople().value(),
          updatedDocument.getIdTypeDocument().value(),
          updatedDocument.getActive().value(),
          updatedDocument.getDescription()?.value(),
        ),
      );
    }
  }

  removeDocument(id: string) {
    this._documents = this._documents.filter((d) => d.getId()?.value() !== id);
    this.apply(new PersonDocumentRemovedEvent(id));
  }

  getId(): PersonId | null {
    return this.id ?? null;
  }
  getFirstName(): PersonFirstName | null {
    return this.first_name;
  }
  getBirthdate(): PersonBirthdate | null {
    return this.birthdate;
  }
  getIdGender(): PersonIdGender | null {
    return this.id_gender;
  }
  getEmail(): PersonEmail {
    return this.email;
  }
  getIdMaritalStatus(): PersonIdMaritalStatus | null {
    return this.id_marital_status;
  }
  getPhone(): PersonPhone | null {
    return this.phone;
  }
  getIdStatus(): PersonIdStatus {
    return this.id_status;
  }
  getMiddleName(): PersonMiddleName | null {
    return this.middle_name ?? null;
  }
  getLastName(): PersonLastName | null {
    return this.last_name;
  }
  getImgPath(): PersonImgPath | null {
    return this.img_path;
  }
}
