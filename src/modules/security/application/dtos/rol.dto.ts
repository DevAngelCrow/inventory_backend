import { Rol } from '../../domain/entities/rol';

export class RolDto<T = unknown, P = unknown> {
  constructor(
    public readonly name: string,
    public readonly description: string,
    public readonly id_status: string,
    public readonly code: string,
    public readonly id?: string,
    public readonly status?: T,
    public readonly permissions?: P[],
    public readonly permissions_id?: string[],
  ) {}
  public static fromEntity(rol: Rol): RolDto {
    return new RolDto(
      rol.getName().value(),
      rol.getDescription().value(),
      rol.getIdStatus().value(),
      rol.getCode().value(),
      rol.getId() ? rol.getId()?.value() : undefined,
      undefined,
      undefined,
      rol.getIdPermissions(),
    );
  }
  public static fromDto<T = unknown, P = unknown>(
    dto: RolDto<T, P>,
  ): RolDto<T, P> {
    return new RolDto(
      dto.name,
      dto.description,
      dto.id_status,
      dto.code,
      dto.id,
      dto.status,
      dto.permissions,
    );
  }
}
