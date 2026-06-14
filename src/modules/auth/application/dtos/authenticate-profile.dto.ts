export class AuthenticateProfileDto {
  constructor(
    // personal info
    public readonly email: string | null,
    public readonly user_name: string | null,
    public readonly first_name: string | null,
    public readonly middle_name: string | null,
    public readonly last_name: string | null,
    public readonly id_marital_status: string | null,
    public readonly birth_date: Date | null,
    public readonly nationalities:
      | {
          id: string;
          name: string;
          abbreviation: string;
          code: string;
          active: boolean;
          iso2: string;
          phone_code: string;
        }[]
      | null,
    public readonly id_gender: string | null,
    public readonly phone_number: string | null,
    public readonly id_status: string | null,
    // documents info
    public readonly document_type: {
      id: string | null;
      name: string | null;
      active: boolean | null;
      description: string | null;
      mask: string | null;
    } | null,
    public readonly document: {
      id?: string;
      document_number?: string;
      description?: string | null;
      active?: boolean;
    } | null,
    // address info
    public readonly country: {
      id: string;
      name: string;
      abbreviation: string;
      code: string;
      active: boolean;
      iso2: string;
      phone_code: string;
    } | null,
    public readonly geographic_division_type: {
      id: string;
      name: string;
      active: boolean;
    } | null,
    public readonly geographic_division: {
      id: string;
      name: string;
      active: boolean;
    } | null,
    public readonly street: string | null,
    public readonly street_number: string | null,
    public readonly house_number: string | null,
    public readonly neighborhood: string | null,
    public readonly block: string | null,
    public readonly pathway: string | null,
    public readonly current: boolean | null,
    public readonly id_address: string | null,
    public readonly id_profile: string | null,
    public readonly id_people: string | null,
    public readonly profile_img: string | null = null,
  ) {}

  public static fromDto(dto: AuthenticateProfileDto): AuthenticateProfileDto {
    return new AuthenticateProfileDto(
      dto.email,
      dto.user_name,
      dto.first_name,
      dto.middle_name,
      dto.last_name,
      dto.id_marital_status,
      dto.birth_date,
      dto.nationalities,
      dto.id_gender,
      dto.phone_number,
      dto.id_status,
      dto.document_type,
      dto.document,
      dto.country,
      dto.geographic_division_type,
      dto.geographic_division,
      dto.street,
      dto.street_number,
      dto.house_number,
      dto.neighborhood,
      dto.block,
      dto.pathway,
      dto.current,
      dto.id_address,
      dto.id_profile,
      dto.id_people,
      dto.profile_img,
    );
  }
}
