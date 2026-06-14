export class UpdatePersonDto {
  constructor(
    public readonly id?: string,
    public readonly first_name?: string | null,
    public readonly birthdate?: Date | null,
    public readonly id_gender?: string | null,
    public readonly email?: string,
    public readonly id_marital_status?: string | null,
    public readonly phone?: string | null,
    public readonly middle_name?: string | null,
    public readonly last_name?: string | null,
    public readonly img_path?: string | null,
    public readonly nationalities?: string[],
    public readonly id_status?: string,
  ) {}
}
