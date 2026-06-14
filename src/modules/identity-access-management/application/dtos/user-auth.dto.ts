export class UserAuthDto {
  constructor(
    public readonly id: string,
    public readonly id_people: string,
    public readonly user_name: string,
    public readonly id_status: string,
    public readonly last_access: Date,
    public readonly is_validated: boolean,
    public readonly permissions: string[],
    public readonly id_session_refresh_token?: string,
  ) {}
  public static fromDto(dto: UserAuthDto): UserAuthDto {
    return new UserAuthDto(
      dto.id,
      dto.id_people,
      dto.user_name,
      dto.id_status,
      dto.last_access,
      dto.is_validated,
      dto.permissions,
      dto.id_session_refresh_token,
    );
  }
}
