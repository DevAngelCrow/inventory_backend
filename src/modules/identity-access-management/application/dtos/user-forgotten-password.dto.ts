export class UserForgottenPasswordDto {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly last_access: Date,
    public readonly is_validated: boolean,
    public readonly id_person: string,
    public readonly id_status: string,
    public readonly user_name: string,
  ) {}
}
