import { CategoryPermissionsDto } from '../../../dtos/category-permissions.dto';

export class CreateCategoryPermissionsCommand {
  constructor(
    public readonly category_permissions_dto: CategoryPermissionsDto,
  ) {}
}
