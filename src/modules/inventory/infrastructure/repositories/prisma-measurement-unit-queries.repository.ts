import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/shared/infrastructure/persistence/prisma/prisma.service';
import { MeasurementUnitQueriesRepository } from '../../application/repositories/measurement-unit-read.repository';
import { MeasurementUnitDto } from '../../application/dtos/measurement-unit.dto';
import { PaginationParamsDto } from '@/shared/application/dtos/pagination.dto';

@Injectable()
export class PrismaMeasurementUnitQueriesRepository
  implements MeasurementUnitQueriesRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async findAll(
    paginationDto: PaginationParamsDto,
  ): Promise<[MeasurementUnitDto[], number]> {
    const skip = (paginationDto.page - 1) * paginationDto.per_page;

    const [raws, count] = await Promise.all([
      this.prisma.client.ctl_measurement_unit.findMany({
        where: { deleted_at: null },
        skip,
        take: paginationDto.per_page,
        orderBy: { name: 'asc' },
      }),
      this.prisma.client.ctl_measurement_unit.count({
        where: { deleted_at: null },
      }),
    ]);

    return [
      raws.map((raw: any) => ({
        id: raw.id,
        name: raw.name,
        abbreviation: raw.abbreviation,
        active: raw.active,
        created_at: raw.created_at,
        updated_at: raw.updated_at,
      })),
      count,
    ];
  }

  async findAllActive(): Promise<MeasurementUnitDto[]> {
    const raws = await this.prisma.client.ctl_measurement_unit.findMany({
      where: { deleted_at: null, active: true },
      orderBy: { name: 'asc' },
    });

    return raws.map((raw: any) => ({
      id: raw.id,
      name: raw.name,
      abbreviation: raw.abbreviation,
      active: raw.active,
      created_at: raw.created_at,
      updated_at: raw.updated_at,
    }));
  }

  async findById(id: string): Promise<MeasurementUnitDto | null> {
    const raw = await this.prisma.client.ctl_measurement_unit.findUnique({
      where: { id, deleted_at: null },
    });

    if (!raw) return null;

    return {
      id: raw.id,
      name: raw.name,
      abbreviation: raw.abbreviation,
      active: raw.active,
      created_at: raw.created_at,
      updated_at: raw.updated_at,
    };
  }
}
