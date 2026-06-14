import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Pagination } from '@/shared/domain/value-object/pagination';
import { GetRolesQuery } from './get-roles.query';
import { PaginationParams } from '@/shared/domain/value-object/pagination-params';
import { RolDto } from '../../../dtos/rol.dto';
import { RolReadRepository } from '../../../repositories/rol-read.repository';

@QueryHandler(GetRolesQuery)
export class GetRolesHandler implements IQueryHandler<GetRolesQuery> {
  constructor(private readonly repository: RolReadRepository) {}
  async execute(query: GetRolesQuery): Promise<Pagination<RolDto> | RolDto[]> {
    if (query.pagination_params) {
      const paginationParams = PaginationParams.create({
        ...query.pagination_params,
      });
      return await this.repository.getAll(
        paginationParams,
        query.filter,
        query.id_status,
      );
    }
    return await this.repository.getAll(
      undefined,
      query.filter,
      query.id_status,
    );
  }
}
