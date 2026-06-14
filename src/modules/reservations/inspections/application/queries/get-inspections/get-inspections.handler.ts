import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetInspectionsQuery } from './get-inspections.query';
import { InspectionQueriesRepository } from '@/modules/reservations/inspections/application/repositories/inspection-read.repository';
import { InspectionDto } from '@/modules/reservations/inspections/application/dtos/inspection.dto';
import { Pagination } from '@/shared/domain/value-object/pagination';
import { PaginationParams } from '@/shared/domain/value-object/pagination-params';

@QueryHandler(GetInspectionsQuery)
export class GetInspectionsHandler implements IQueryHandler<GetInspectionsQuery> {
  constructor(private readonly repository: InspectionQueriesRepository) {}

  async execute(
    query: GetInspectionsQuery,
  ): Promise<Pagination<InspectionDto> | InspectionDto[]> {
    if (query.pagination_params) {
      const paginationParams = PaginationParams.create({
        ...query.pagination_params,
      });
      return await this.repository.getAll(
        paginationParams,
        query.filter_reservation,
        query.filter_status,
      );
    }
    return await this.repository.getAll(
      undefined,
      query.filter_reservation,
      query.filter_status,
    );
  }
}
