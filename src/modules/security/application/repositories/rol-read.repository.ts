import { Pagination } from '@/shared/domain/value-object/pagination';
import { PaginationParams } from '@/shared/domain/value-object/pagination-params';
import { RolDto } from '../dtos/rol.dto';

export abstract class RolReadRepository {
  abstract getAll(
    pagination_params?: PaginationParams,
    filter?: string,
    id_status?: string,
  ): Promise<Pagination<RolDto> | RolDto[]>;
  abstract getById(id: string): Promise<RolDto | null>;
  abstract getByCode(code: string): Promise<RolDto | null>;
}
