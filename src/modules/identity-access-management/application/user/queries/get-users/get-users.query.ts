import { PaginationParamsDto } from '@/shared/application/dtos/pagination.dto';
interface Filter {
  name?: string;
  email?: string;
  status?: string;
}
export class GetUsersQuery {
  constructor(
    public readonly pagination_params?: PaginationParamsDto,
    public readonly filter?: Filter,
  ) {}
}
