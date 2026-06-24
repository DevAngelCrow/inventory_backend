import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/shared/infrastructure/persistence/prisma/prisma.service';
import { Maintenance } from '../../domain/entities/maintenance';
import { MaintenanceRepository } from '../../domain/repositories/maintenance.repository';
import { MaintenanceId } from '../../domain/value-objects/maintenance-value-object/maintenance-id';
import { MaintenanceDescription } from '../../domain/value-objects/maintenance-value-object/maintenance-description';
import { MaintenanceCost } from '../../domain/value-objects/maintenance-value-object/maintenance-cost';
import { MaintenanceQuantity } from '../../domain/value-objects/maintenance-value-object/maintenance-quantity';
import { MaintenanceDateStart } from '../../domain/value-objects/maintenance-value-object/maintenance-date-start';
import { MaintenanceDateEnd } from '../../domain/value-objects/maintenance-value-object/maintenance-date-end';
import { MaintenanceResolved } from '../../domain/value-objects/maintenance-value-object/maintenance-resolved';
import { MaintenanceCreatedAt } from '../../domain/value-objects/maintenance-value-object/maintenance-created-at';
import { MaintenanceUpdatedAt } from '../../domain/value-objects/maintenance-value-object/maintenance-updated-at';
import { ProductId } from '../../domain/value-objects/product-value-object/product-id';
import { Pagination } from '@/shared/domain/value-object/pagination';
import { PaginationParamsDto } from '@/shared/application/dtos/pagination.dto';
import { EntityList } from '@/shared/domain/value-object/entity-list';
import { TotalItems } from '@/shared/domain/value-object/total-items';
import { TotalPages } from '@/shared/domain/value-object/total-page';
import { Page } from '@/shared/domain/value-object/page';
import { PerPage } from '@/shared/domain/value-object/per-page';
import { mnt_product_maintenance } from 'generated/prisma/client';

@Injectable()
export class PrismaMaintenanceRepository implements MaintenanceRepository {
  constructor(private readonly prisma: PrismaService) {}

  private mapToEntity(record: mnt_product_maintenance): Maintenance {
    return new Maintenance(
      new MaintenanceId(record.id),
      new MaintenanceDescription(record.description),
      new MaintenanceCost(record.cost ? Number(record.cost) : null),
      new MaintenanceQuantity(record.quantity),
      new MaintenanceDateStart(record.date_start),
      new MaintenanceDateEnd(record.date_end),
      new MaintenanceResolved(record.resolved),
      new MaintenanceCreatedAt(record.created_at || new Date()),
      new MaintenanceUpdatedAt(record.updated_at),
      new ProductId(record.id_product),
    );
  }

  async save(maintenance: Maintenance): Promise<Maintenance> {
    const data = {
      id: maintenance.getId().value(),
      description: maintenance.getDescription().value(),
      cost: maintenance.getCost().value(),
      quantity: maintenance.getQuantity().value(),
      date_start: maintenance.getDateStart().value(),
      date_end: maintenance.getDateEnd().value(),
      resolved: maintenance.getResolved().value(),
      id_product: maintenance.getIdProduct().value(),
      updated_at: maintenance.getUpdatedAt().value(),
    };

    const record = await this.prisma.client.mnt_product_maintenance.upsert({
      where: { id: maintenance.getId().value() },
      create: {
        ...data,
        created_at: maintenance.getCreatedAt().value(),
      },
      update: data,
    });

    return this.mapToEntity(record);
  }

  async findById(id: string): Promise<Maintenance | null> {
    const record = await this.prisma.client.mnt_product_maintenance.findUnique({
      where: { id },
    });
    if (!record) return null;
    return this.mapToEntity(record);
  }

  async findAll(
    params: PaginationParamsDto,
    id_product?: string,
    resolved?: boolean,
  ): Promise<Pagination<Maintenance> | Maintenance[]> {
    const where: any = {};
    if (id_product) where.id_product = id_product;
    if (resolved !== undefined) where.resolved = resolved;

    if (!params.page || !params.per_page) {
      const records = await this.prisma.client.mnt_product_maintenance.findMany({
        where,
        orderBy: { date_start: 'desc' },
      });
      return records.map(this.mapToEntity);
    }

    const { page, per_page } = params;
    const skip = (page - 1) * per_page;

    const [records, total] = await Promise.all([
      this.prisma.client.mnt_product_maintenance.findMany({
        where,
        skip,
        take: per_page,
        orderBy: { date_start: 'desc' },
      }),
      this.prisma.client.mnt_product_maintenance.count({ where }),
    ]);

    const entities = records.map(this.mapToEntity.bind(this));
    return new Pagination<Maintenance>(
      new EntityList<Maintenance>(entities),
      new Page(page),
      new PerPage(per_page),
      new TotalItems(total),
      new TotalPages(Math.ceil(total / per_page))
    );
  }
}
