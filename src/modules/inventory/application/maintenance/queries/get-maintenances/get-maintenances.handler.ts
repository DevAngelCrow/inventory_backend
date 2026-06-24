import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetMaintenancesQuery } from './get-maintenances.query';
import { MaintenanceDto } from '../../../dtos/maintenance.dto';
import { Pagination } from '@/shared/domain/value-object/pagination';
import { MaintenanceQueriesRepository } from '../../../repositories/maintenance-read.repository';

@QueryHandler(GetMaintenancesQuery)
export class GetMaintenancesHandler implements IQueryHandler<GetMaintenancesQuery> {
  constructor(private readonly repository: MaintenanceQueriesRepository) {}

  async execute(
    query: GetMaintenancesQuery,
  ): Promise<Pagination<MaintenanceDto> | MaintenanceDto[]> {
    return await this.repository.getAll(
      query.paginationParams,
      query.id_product,
      query.resolved,
    );
  }
}
