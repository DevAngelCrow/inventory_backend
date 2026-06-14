import { CategoryPermissionsDto } from '../../../dtos/category-permissions.dto';

export class UpdateCategoryPermissionsCommand {
  constructor(
    public readonly category_permissions_dto: CategoryPermissionsDto,
  ) {}
}
