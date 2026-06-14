import { Permissions } from '../../domain/entities/permissions';

export class PermissionsDto<T = unknown> {
  constructor(
    public readonly name: string,
    public readonly id_category_permissions: string,
    public readonly description: string,
    public readonly active: boolean,
    public readonly id?: string,
    public readonly category?: T,
    public readonly id_permissions?: string[],
  ) {}
  public static fromEntity(permissions: Permissions): PermissionsDto {
    return new PermissionsDto(
      permissions.getName().value(),
      permissions.getIdCategoryPermissions().value(),
      permissions.getDescription().value(),
      permissions.getActive().value(),
      permissions.getId() ? permissions.getId()?.value() : undefined,
    );
  }
  public static fromDto<T = unknown>(
    dto: PermissionsDto<T>,
  ): PermissionsDto<T> {
    return new PermissionsDto(
      dto.name,
      dto.id_category_permissions,
      dto.description,
      dto.active,
      dto.id,
      dto.category,
    );
  }
}
