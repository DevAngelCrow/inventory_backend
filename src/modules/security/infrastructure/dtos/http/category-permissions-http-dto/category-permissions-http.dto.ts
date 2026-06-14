import { GlobalStatusDto } from '@/modules/catalogs/application/dtos/global-status.dto';
import { CategoryPermissions } from '@/modules/security/domain/entities/category-permissions';

export class CategoryPermissionsHttpDto {
  constructor(
    public readonly name: string,
    public readonly description: string,
    public readonly active: boolean,
    public readonly id?: string,
    public readonly status?: GlobalStatusDto,
  ) {}
  public static fromEntity(
    categoryPermissions: CategoryPermissions,
  ): CategoryPermissionsHttpDto {
    return new CategoryPermissionsHttpDto(
      categoryPermissions.getName().value(),
      categoryPermissions.getDescription().value(),
      categoryPermissions.getActive().value(),
      categoryPermissions.getId()
        ? categoryPermissions.getId()?.value()
        : undefined,
    );
  }
  public static fromDto(
    dto: CategoryPermissionsHttpDto,
  ): CategoryPermissionsHttpDto {
    return new CategoryPermissionsHttpDto(
      dto.name,
      dto.description,
      dto.active,
      dto.id,
      dto.status,
    );
  }
}
