import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/shared/infrastructure/persistence/prisma/prisma.service';
import { Maintenance } from '../../domain/entities/maintenance';
import { MaintenanceRepository } from '../../domain/repositories/maintenance.repository';
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
      record.id,
      record.description,
      record.cost ? Number(record.cost) : null,
      record.quantity,
      record.date_start,
      record.date_end,
      record.resolved,
      record.created_at || new Date(),
      record.updated_at,
      record.id_product,
    );
  }

  async save(maintenance: Maintenance): Promise<Maintenance> {
    const data = {
      id: maintenance.getId(),
      description: maintenance.getDescription(),
      cost: maintenance.getCost() !== null ? maintenance.getCost() : null,
      quantity: maintenance.getQuantity(),
      date_start: maintenance.getDateStart(),
      date_end: maintenance.getDateEnd(),
      resolved: maintenance.getResolved(),
      id_product: maintenance.getIdProduct(),
      updated_at: maintenance.getUpdatedAt(),
    };

    const record = await this.prisma.client.mnt_product_maintenance.upsert({
      where: { id: maintenance.getId() },
      create: {
        ...data,
        created_at: maintenance.getCreatedAt(),
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
