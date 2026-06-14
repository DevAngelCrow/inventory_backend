import { CategoryStatusDto } from '../../../dtos/category-status.dto';

export class UpdateCategoryStatusCommand {
  constructor(public readonly category_status_dto: CategoryStatusDto) {}
}
