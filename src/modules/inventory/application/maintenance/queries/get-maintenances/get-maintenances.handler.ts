import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetMaintenancesQuery } from './get-maintenances.query';
import { MAINTENANCE_REPOSITORY, MaintenanceRepository } from '../../../../domain/repositories/maintenance.repository';
import { MaintenanceDto } from '../../../dtos/maintenance.dto';
import { Pagination } from '@/shared/domain/value-object/pagination';
import { EntityList } from '@/shared/domain/value-object/entity-list';
import { Page } from '@/shared/domain/value-object/page';
import { PerPage } from '@/shared/domain/value-object/per-page';
import { TotalItems } from '@/shared/domain/value-object/total-items';
import { TotalPages } from '@/shared/domain/value-object/total-page';
import { Maintenance } from '../../../../domain/entities/maintenance';
import { PrismaService } from '@/shared/infrastructure/persistence/prisma/prisma.service';
import { GetBooleanStatusCatalogService } from '@/shared/infrastructure/services/get-status-catalog.service';
import { StatusMapperUtil } from '@/shared/infrastructure/utils/status-mapper.util';
import { BooleanStatusData } from '@/shared/infrastructure/interfaces/boolean-status-data.interface';

@QueryHandler(GetMaintenancesQuery)
export class GetMaintenancesHandler implements IQueryHandler<GetMaintenancesQuery> {
  constructor(
    @Inject(MAINTENANCE_REPOSITORY)
    private readonly repository: MaintenanceRepository,
    private readonly prisma: PrismaService,
  ) {}

  async execute(query: GetMaintenancesQuery): Promise<Pagination<MaintenanceDto> | MaintenanceDto[]> {
    const [result, catalog_status] = await Promise.all([
      this.repository.findAll(
        query.paginationParams,
        query.id_product,
        query.resolved,
      ),
      GetBooleanStatusCatalogService.getStatus(this.prisma),
    ]);

    if (result instanceof Pagination) {
      const dtos = result.getEntityList().map((m) => this.mapToDto(m, catalog_status));
      return new Pagination<MaintenanceDto>(
        new EntityList<MaintenanceDto>(dtos),
        new Page(result.getPage()),
        new PerPage(result.getPerPage()),
        new TotalItems(result.getTotalItems()),
        new TotalPages(result.getTotalPages()),
      );
    }

    return (result as Maintenance[]).map((m) => this.mapToDto(m, catalog_status));
  }

  private mapToDto(m: Maintenance, catalog_status?: Map<string, BooleanStatusData>): MaintenanceDto {
    const status = StatusMapperUtil.getStatusFromBoolean(
      !m.getResolved(),
      catalog_status,
      'mapToDto',
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
