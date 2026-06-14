import { GlobalStatusDto } from '@/modules/catalogs/application/dtos/global-status.dto';
import { Permissions } from '@/modules/security/domain/entities/permissions';
export class PermissionsHttpDto<T = unknown> {
  constructor(
    public readonly name: string,
    public readonly id_category_permissions: string,
    public readonly description: string,
    public readonly active: boolean,
    public readonly id?: string,
    public readonly category?: T,
    public readonly status?: GlobalStatusDto,
  ) {}
  public static fromEntity(permissions: Permissions): PermissionsHttpDto {
    return new PermissionsHttpDto(
      permissions.getName().value(),
      permissions.getIdCategoryPermissions().value(),
      permissions.getDescription().value(),
      permissions.getActive().value(),
      permissions.getId() ? permissions.getId()?.value() : undefined,
    );
  }
  public static fromDto<T>(dto: PermissionsHttpDto<T>): PermissionsHttpDto<T> {
    return new PermissionsHttpDto(
      dto.name,
      dto.id_category_permissions,
      dto.description,
      dto.active,
      dto.id,
      dto.category,
      dto.status,
    );
  }
}
