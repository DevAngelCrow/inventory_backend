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

@QueryHandler(GetMaintenancesQuery)
export class GetMaintenancesHandler implements IQueryHandler<GetMaintenancesQuery> {
  constructor(
    @Inject(MAINTENANCE_REPOSITORY)
    private readonly repository: MaintenanceRepository,
  ) {}

  async execute(query: GetMaintenancesQuery): Promise<Pagination<MaintenanceDto> | MaintenanceDto[]> {
    const result = await this.repository.findAll(
      query.paginationParams,
      query.id_product,
      query.resolved,
    );

    if (result instanceof Pagination) {
      const dtos = result.getEntityList().map((m) => this.mapToDto(m));
      return new Pagination<MaintenanceDto>(
        new EntityList<MaintenanceDto>(dtos),
        new Page(result.getPage()),
        new PerPage(result.getPerPage()),
        new TotalItems(result.getTotalItems()),
        new TotalPages(result.getTotalPages()),
      );
    }

    return (result as Maintenance[]).map(this.mapToDto);
  }

  private mapToDto(m: Maintenance): MaintenanceDto {
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
