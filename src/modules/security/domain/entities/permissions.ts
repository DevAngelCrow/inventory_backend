import { PermissionsActive } from '../value-objects/permissions-value-object/permissions-active';
import { PermissionsDescription } from '../value-objects/permissions-value-object/permissions-description';
import { PermissionsId } from '../value-objects/permissions-value-object/permissions-id';
import { PermissionsIdCategoryPermissions } from '../value-objects/permissions-value-object/permissions-id-category-permissions';
import { PermissionsName } from '../value-objects/permissions-value-object/permissions-name';

export class Permissions {
  constructor(
    private readonly name: PermissionsName,
    private readonly id_category_permissions: PermissionsIdCategoryPermissions,
    private readonly description: PermissionsDescription,
    private readonly active: PermissionsActive,
    private readonly id?: PermissionsId,
  ) {}
  public static create(data: {
    id?: string;
    name: string;
    id_category_permissions: string;
    description: string;
    active: boolean;
  }): Permissions {
    return new Permissions(
      new PermissionsName(data.name),
      new PermissionsIdCategoryPermissions(data.id_category_permissions),
      new PermissionsDescription(data.description),
      new PermissionsActive(data.active),
      data.id ? new PermissionsId(data.id) : undefined,
    );
  }
  getName(): PermissionsName {
    return this.name;
  }
  getIdCategoryPermissions(): PermissionsIdCategoryPermissions {
    return this.id_category_permissions;
  }
  getDescription(): PermissionsDescription {
    return this.description;
  }
  getActive(): PermissionsActive {
    return this.active;
  }
  getId(): PermissionsId | undefined {
    return this.id;
  }
}
