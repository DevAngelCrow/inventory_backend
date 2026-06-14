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

export class Person {
  constructor(
    private readonly first_name: PersonFirstName | null,
    private readonly birthdate: PersonBirthdate | null,
    private readonly id_gender: PersonIdGender | null,
    private readonly email: PersonEmail,
    private readonly id_marital_status: PersonIdMaritalStatus | null,
    private readonly phone: PersonPhone | null,
    private readonly id_status: PersonIdStatus,
    private readonly last_name: PersonLastName | null,
    private readonly img_path: PersonImgPath | null,
    private readonly middle_name?: PersonMiddleName | null,
    private readonly id?: PersonId | null,
  ) {}
  static create(data: {
    id?: string;
    first_name: string | null;
    birthdate: Date | null;
    id_gender: string | null;
    email: string;
    id_marital_status: string | null;
    phone: string | null;
    id_status: string;
    middle_name?: string | null;
    last_name: string | null;
    img_path: string | null;
  }): Person {
    return new Person(
      data.first_name ? new PersonFirstName(data.first_name) : null,
      data.birthdate ? new PersonBirthdate(data.birthdate) : null,
      data.id_gender ? new PersonIdGender(data.id_gender) : null,
      new PersonEmail(data.email),
      data.id_marital_status
        ? new PersonIdMaritalStatus(data.id_marital_status)
        : null,
      data.phone ? new PersonPhone(data.phone) : null,
      new PersonIdStatus(data.id_status),
      data.last_name ? new PersonLastName(data.last_name) : null,
      data.img_path ? new PersonImgPath(data.img_path) : null,
      data.middle_name ? new PersonMiddleName(data.middle_name) : null,
      data.id ? new PersonId(data.id) : null,
    );
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
