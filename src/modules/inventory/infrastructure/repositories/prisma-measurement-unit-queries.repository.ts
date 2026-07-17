import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/shared/infrastructure/persistence/prisma/prisma.service';
import { MeasurementUnitQueriesRepository } from '../../application/repositories/measurement-unit-read.repository';
import { MeasurementUnitDto } from '../../application/dtos/measurement-unit.dto';
import { PaginationParamsDto } from '@/shared/application/dtos/pagination.dto';
import { GetBooleanStatusCatalogService } from '@/shared/infrastructure/services/get-status-catalog.service';
import { StatusMapperUtil } from '@/shared/infrastructure/utils/status-mapper.util';
import { BooleanStatusData } from '@/shared/infrastructure/interfaces/boolean-status-data.interface';

@Injectable()
export class PrismaMeasurementUnitQueriesRepository
  implements MeasurementUnitQueriesRepository
{
  constructor(private readonly prisma: PrismaService) {}

  private mapToDto(
    raw: any,
    catalog_status?: Map<string, BooleanStatusData>,
  ): MeasurementUnitDto {
    const status = StatusMapperUtil.getStatusFromBoolean(
      raw.active,
      catalog_status,
      'mapToDto',
    );

    return new MeasurementUnitDto(
      raw.id,
      raw.name,
      raw.abbreviation,
      raw.active,
      raw.created_at,
      raw.updated_at,
      status,
    );
  }

  async findAll(
    paginationDto: PaginationParamsDto,
  ): Promise<[MeasurementUnitDto[], number]> {
    const skip = (paginationDto.page - 1) * paginationDto.per_page;

    const [raws, count, catalog_status] = await Promise.all([
      this.prisma.client.ctl_measurement_unit.findMany({
        where: { deleted_at: null },
        skip,
        take: paginationDto.per_page,
        orderBy: { name: 'asc' },
      }),
      this.prisma.client.ctl_measurement_unit.count({
        where: { deleted_at: null },
      }),
      GetBooleanStatusCatalogService.getStatus(this.prisma),
    ]);

    return [raws.map((raw: any) => this.mapToDto(raw, catalog_status)), count];
  }

  async findAllActive(): Promise<MeasurementUnitDto[]> {
    const [raws, catalog_status] = await Promise.all([
      this.prisma.client.ctl_measurement_unit.findMany({
        where: { deleted_at: null, active: true },
        orderBy: { name: 'asc' },
      }),
      GetBooleanStatusCatalogService.getStatus(this.prisma),
    ]);

    return raws.map((raw: any) => this.mapToDto(raw, catalog_status));
  }

  async findById(id: string): Promise<MeasurementUnitDto | null> {
    const [raw, catalog_status] = await Promise.all([
      this.prisma.client.ctl_measurement_unit.findUnique({
        where: { id, deleted_at: null },
      }),
      GetBooleanStatusCatalogService.getStatus(this.prisma),
    ]);

    if (!raw) return null;

    return this.mapToDto(raw, catalog_status);
  }
}
