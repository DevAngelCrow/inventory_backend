import { CategoryStatusDto } from '../../../dtos/category-status.dto';

export class CreateCategoryStatusCommand {
  constructor(public readonly category_status_dto: CategoryStatusDto) {}
}
