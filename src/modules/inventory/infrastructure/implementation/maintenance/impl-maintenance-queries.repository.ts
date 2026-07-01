import { Injectable } from '@nestjs/common';
import { Prisma, mnt_product_maintenance } from 'generated/prisma/client';
import { MaintenanceQueriesRepository } from '@/modules/inventory/application/repositories/maintenance-read.repository';
import { MaintenanceDto } from '@/modules/inventory/application/dtos/maintenance.dto';
import { PrismaService } from '@/shared/infrastructure/persistence/prisma/prisma.service';
import { Pagination } from '@/shared/domain/value-object/pagination';
import { PaginationParamsDto } from '@/shared/application/dtos/pagination.dto';
import { EntityList } from '@/shared/domain/value-object/entity-list';
import { Page } from '@/shared/domain/value-object/page';
import { PerPage } from '@/shared/domain/value-object/per-page';
import { TotalItems } from '@/shared/domain/value-object/total-items';
import { TotalPages } from '@/shared/domain/value-object/total-page';
import { GetBooleanStatusCatalogService } from '@/shared/infrastructure/services/get-status-catalog.service';
import { StatusMapperUtil } from '@/shared/infrastructure/utils/status-mapper.util';
import { BooleanStatusData } from '@/shared/infrastructure/interfaces/boolean-status-data.interface';

@Injectable()
export class ImplMaintenanceQueriesRepository implements MaintenanceQueriesRepository {
  constructor(private readonly prisma: PrismaService) {}

  private mapToDto(
    record: mnt_product_maintenance,
    catalog_status?: Map<string, BooleanStatusData>,
  ): MaintenanceDto {
    const status = StatusMapperUtil.getStatusFromBoolean(
      !record.resolved,
      catalog_status,
      'mapToDto',
    );
    return new MaintenanceDto(
      record.id,
      record.description,
      record.cost ? Number(record.cost) : null,
      record.quantity,
      record.date_start,
      record.date_end as Date,
      record.resolved,
      record.created_at,
      record.updated_at,
      record.id_product,
      status,
    );
  }

  async getAll(
    params: PaginationParamsDto,
    id_product?: string,
    resolved?: boolean,
  ): Promise<Pagination<MaintenanceDto> | MaintenanceDto[]> {
    const where: Prisma.mnt_product_maintenanceWhereInput = {};
    if (id_product) where.id_product = id_product;
    if (resolved !== undefined) where.resolved = resolved;

    const [records, total, catalog_status] = await Promise.all([
      this.prisma.client.mnt_product_maintenance.findMany({
        where,
        skip:
          params.page && params.per_page
            ? (params.page - 1) * params.per_page
            : undefined,
        take: params.per_page ? params.per_page : undefined,
        orderBy: { date_start: 'desc' },
      }),
      this.prisma.client.mnt_product_maintenance.count({ where }),
      GetBooleanStatusCatalogService.getStatus(this.prisma),
    ]);

    const dtos = records.map((r) => this.mapToDto(r, catalog_status));

    if (!params.page || !params.per_page) {
      return dtos;
    }

    const entityList =
      dtos.length > 0
        ? new EntityList<MaintenanceDto>(dtos)
        : new EntityList<MaintenanceDto>([]);
    return new Pagination<MaintenanceDto>(
      entityList,
      new Page(params.page),
      new PerPage(params.per_page),
      new TotalItems(total),
      new TotalPages(Math.ceil(total / params.per_page)),
    );
  }

  async getById(id: string): Promise<MaintenanceDto | null> {
    const [record, catalog_status] = await Promise.all([
      this.prisma.client.mnt_product_maintenance.findUnique({ where: { id } }),
      GetBooleanStatusCatalogService.getStatus(this.prisma),
    ]);

    if (!record) return null;
    return this.mapToDto(record, catalog_status);
  }
}
