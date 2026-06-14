import { PaginationParamsDto } from '@/shared/application/dtos/pagination.dto';

export class GetStorageFilesQuery {
  constructor(
    public readonly pagination_params?: PaginationParamsDto,
    public readonly id_provider?: string,
  ) {}
}
