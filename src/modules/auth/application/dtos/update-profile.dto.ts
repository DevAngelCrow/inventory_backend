export class UpdateProfileDto<T = unknown> {
  constructor(
    // People data
    public readonly first_name: string | null,
    public readonly middle_name: string | null,
    public readonly last_name: string | null,
    public readonly birthdate: Date | null,
    public readonly email: string,
    public readonly id_gender: string | null,
    public readonly id_marital_status: string | null,
    public readonly phone: string | null,
    public readonly id_status: string | null,
    public readonly img_path: string | null,
    //public readonly id_status: string,
    public readonly nationalities: string[] = [],
    public readonly file_img: T | null = null,
    public readonly id_people: string | null,

    // User data
    public readonly user_name: string,
    public readonly password: string,
    //public readonly id_status_user: number,
    public readonly last_access: Date | null,
    public readonly is_validated: boolean | null,
    public readonly id_user: string,

    // Address data
    public readonly street: string | null,
    public readonly street_number: string | null,
    public readonly neighborhood: string | null,
    public readonly id_geographic_division: string | null,
    public readonly house_number: string | null,
    public readonly block: string | null,
    public readonly pathway: string | null,
    public readonly current: boolean | null,
    public readonly id_address: string,
    public readonly active_address: boolean | null,

    // Document data
    public readonly id_type_document: string,
    public readonly description: string | null,
    public readonly document_number: string | null,
    public readonly active: boolean | null,
    public readonly id_document: string,
  ) {}
}
