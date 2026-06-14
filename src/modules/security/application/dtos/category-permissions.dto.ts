import { CategoryPermissions } from '../../domain/entities/category-permissions';

export class CategoryPermissionsDto {
  constructor(
    public readonly name: string,
    public readonly description: string,
    public readonly active: boolean,
    public readonly id?: string,
  ) {}
  public static fromEntity(
    categoryPermissions: CategoryPermissions,
  ): CategoryPermissionsDto {
    return new CategoryPermissionsDto(
      categoryPermissions.getName().value(),
      categoryPermissions.getDescription().value(),
      categoryPermissions.getActive().value(),
      categoryPermissions.getId()
        ? categoryPermissions.getId()?.value()
        : undefined,
    );
  }
}
