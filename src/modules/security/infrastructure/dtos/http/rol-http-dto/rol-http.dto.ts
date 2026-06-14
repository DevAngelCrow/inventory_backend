import { Rol } from '@/modules/security/domain/entities/rol';
export class RolHttpDto<T = unknown, P = unknown> {
  constructor(
    public readonly name: string,
    public readonly description: string,
    public readonly id_status: string,
    public readonly code: string,
    public readonly id?: string,
    public readonly status?: T,
    public readonly permissions?: P[],
  ) {}
  public static fromEntity(rol: Rol): RolHttpDto {
    return new RolHttpDto(
      rol.getName().value(),
      rol.getDescription().value(),
      rol.getIdStatus().value(),
      rol.getCode().value(),
      rol.getId() ? rol.getId()?.value() : undefined,
    );
  }
  public static fromDto<T = unknown, P = unknown>(
    dto: RolHttpDto<T, P>,
  ): RolHttpDto<T, P> {
    return new RolHttpDto(
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
