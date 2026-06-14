import { CategoryPermissions } from '../entities/category-permissions';
import { CategoryPermissionsId } from '../value-objects/category-permissions-value-object/category-permissions-id';

export abstract class CategoryPermissionsRepository {
  abstract create(category_permissions: CategoryPermissions): Promise<void>;
  abstract update(category_permissions: CategoryPermissions): Promise<void>;
  abstract toggleStatus(
    id: CategoryPermissionsId,
  ): Promise<CategoryPermissions>;
}
