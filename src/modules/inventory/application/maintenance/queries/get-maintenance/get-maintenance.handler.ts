import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetMaintenanceQuery } from './get-maintenance.query';
import { MAINTENANCE_REPOSITORY, MaintenanceRepository } from '../../../../domain/repositories/maintenance.repository';
import { MaintenanceDto } from '../../../dtos/maintenance.dto';
import { PrismaService } from '@/shared/infrastructure/persistence/prisma/prisma.service';
import { GetBooleanStatusCatalogService } from '@/shared/infrastructure/services/get-status-catalog.service';
import { StatusMapperUtil } from '@/shared/infrastructure/utils/status-mapper.util';

@QueryHandler(GetMaintenanceQuery)
export class GetMaintenanceHandler implements IQueryHandler<GetMaintenanceQuery> {
  constructor(
    @Inject(MAINTENANCE_REPOSITORY)
    private readonly repository: MaintenanceRepository,
    private readonly prisma: PrismaService,
  ) {}

  async execute(query: GetMaintenanceQuery): Promise<MaintenanceDto | null> {
    const [m, catalog_status] = await Promise.all([
      this.repository.findById(query.id),
      GetBooleanStatusCatalogService.getStatus(this.prisma),
    ]);
    if (!m) return null;
    
    const status = StatusMapperUtil.getStatusFromBoolean(
      !m.getResolved(),
      catalog_status,
      'GetMaintenanceHandler',
    );
    
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
      status,
    );
  }
}
