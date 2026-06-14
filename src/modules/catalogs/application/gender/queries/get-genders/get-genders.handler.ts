import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Pagination } from '@/shared/domain/value-object/pagination';
import { GenderQueriesRepository } from '../../../repositories/gender-read.repository';
import { GetGendersQuery } from './get-genders.query';
import { GenderDto } from '../../../dtos/gender.dto';
import { PaginationParams } from '@/shared/domain/value-object/pagination-params';

@QueryHandler(GetGendersQuery)
export class GetGendersHandler implements IQueryHandler<GetGendersQuery> {
  constructor(private readonly repository: GenderQueriesRepository) {}
  async execute(
    query: GetGendersQuery,
  ): Promise<Pagination<GenderDto> | GenderDto[]> {
    if (query.pagination_params) {
      const paginationParams = PaginationParams.create({
        ...query.pagination_params,
      });
      return await this.repository.getAll(paginationParams, query.filter);
    }
    return await this.repository.getAll(undefined, query.filter);
  }
}
