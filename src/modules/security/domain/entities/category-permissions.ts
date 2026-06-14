import { CategoryPermissionsActive } from '../value-objects/category-permissions-value-object/category-permissions-active';
import { CategoryPermissionsDescription } from '../value-objects/category-permissions-value-object/category-permissions-description';
import { CategoryPermissionsId } from '../value-objects/category-permissions-value-object/category-permissions-id';
import { CategoryPermissionsName } from '../value-objects/category-permissions-value-object/category-permissions-name';

export class CategoryPermissions {
  constructor(
    private readonly name: CategoryPermissionsName,
    private readonly description: CategoryPermissionsDescription,
    private readonly active: CategoryPermissionsActive,
    private readonly id?: CategoryPermissionsId,
  ) {}
  public static create(data: {
    id?: string;
    name: string;
    description: string;
    active: boolean;
  }): CategoryPermissions {
    return new CategoryPermissions(
      new CategoryPermissionsName(data.name),
      new CategoryPermissionsDescription(data.description),
      new CategoryPermissionsActive(data.active),
      data?.id ? new CategoryPermissionsId(data.id) : undefined,
    );
  }
  getName(): CategoryPermissionsName {
    return this.name;
  }
  getDescription(): CategoryPermissionsDescription {
    return this.description;
  }
  getActive(): CategoryPermissionsActive {
    return this.active;
  }
  getId(): CategoryPermissionsId | undefined {
    return this.id;
  }
}
