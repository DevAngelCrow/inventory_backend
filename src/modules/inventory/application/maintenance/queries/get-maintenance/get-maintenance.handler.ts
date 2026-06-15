import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetMaintenanceQuery } from './get-maintenance.query';
import { MAINTENANCE_REPOSITORY, MaintenanceRepository } from '../../../../domain/repositories/maintenance.repository';
import { MaintenanceDto } from '../../../dtos/maintenance.dto';

@QueryHandler(GetMaintenanceQuery)
export class GetMaintenanceHandler implements IQueryHandler<GetMaintenanceQuery> {
  constructor(
    @Inject(MAINTENANCE_REPOSITORY)
    private readonly repository: MaintenanceRepository,
  ) {}

  async execute(query: GetMaintenanceQuery): Promise<MaintenanceDto | null> {
    const m = await this.repository.findById(query.id);
    if (!m) return null;
    return new MaintenanceDto(
      m.getId(),
      m.getDescription(),
      m.getCost(),
      m.getQuantity(),
      m.getDateStart(),
      m.getDateEnd(),
      m.getResolved(),
      m.getCreatedAt(),
      m.getUpdatedAt(),
      m.getIdProduct(),
    );
  }
}
