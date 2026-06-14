export class UserDto<S = unknown> {
  constructor(
    public readonly id_people: string,
    public readonly user_name: string,
    public readonly password: string,
    public readonly id_status: string,
    public readonly last_access: Date,
    public readonly is_validated: boolean,
    public readonly permissions: string[],
    public readonly id?: string,
    public readonly id_session_refresh_token?: string,
    public readonly status?: S,
    public readonly email?: string,
    public readonly phone?: string,
  ) {}
}
