import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetMaintenanceQuery } from './get-maintenance.query';
import { MaintenanceDto } from '../../../dtos/maintenance.dto';
import { MaintenanceQueriesRepository } from '../../../repositories/maintenance-read.repository';

@QueryHandler(GetMaintenanceQuery)
export class GetMaintenanceHandler implements IQueryHandler<GetMaintenanceQuery> {
  constructor(
    private readonly repository: MaintenanceQueriesRepository,
  ) {}

  async execute(query: GetMaintenanceQuery): Promise<MaintenanceDto | null> {
    return await this.repository.getById(query.id);
  }
}
