import { Person } from '../../domain/entities/person';
export class PersonDto {
  constructor(
    public readonly first_name: string | null,
    public readonly birthdate: Date | null,
    public readonly id_gender: string | null,
    public readonly email: string,
    public readonly id_marital_status: string | null,
    public readonly phone: string | null,
    public readonly id_status: string,
    public readonly middle_name: string | null,
    public readonly last_name: string | null,
    public readonly img_path: string | null,
    public readonly nationalities: string[] = [],
    public readonly id?: string,
  ) {}
  public static fromEntity(
    person: Person,
    nationalities: string[] = [],
  ): PersonDto {
    return new PersonDto(
      person.getFirstName()?.value() ?? null,
      person.getBirthdate() ? person.getBirthdate()!.value() : null,
      person.getIdGender()?.value() ?? null,
      person.getEmail().value(),
      person.getIdMaritalStatus()?.value() ?? null,
      person.getPhone()?.value() ?? null,
      person.getIdStatus().value(),
      person.getMiddleName() ? person.getMiddleName()!.value() : null,
      person.getLastName()?.value() ?? null,
      person.getImgPath()?.value() ?? null,
      nationalities,
      person.getId()?.value(),
    );
  }
}
