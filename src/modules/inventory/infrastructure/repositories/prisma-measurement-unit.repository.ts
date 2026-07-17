import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/shared/infrastructure/persistence/prisma/prisma.service';
import { MeasurementUnitRepository } from '../../domain/repositories/measurement-unit-repository';
import { MeasurementUnit } from '../../domain/entities/measurement-unit';
import { MeasurementUnitId } from '../../domain/value-objects/measurement-unit-value-object/measurement-unit-id';
import { MeasurementUnitName } from '../../domain/value-objects/measurement-unit-value-object/measurement-unit-name';
import { MeasurementUnitAbbreviation } from '../../domain/value-objects/measurement-unit-value-object/measurement-unit-abbreviation';
import { MeasurementUnitActive } from '../../domain/value-objects/measurement-unit-value-object/measurement-unit-active';

@Injectable()
export class PrismaMeasurementUnitRepository
  implements MeasurementUnitRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async save(measurementUnit: MeasurementUnit): Promise<void> {
    const data = {
      id: measurementUnit.id.value(),
      name: measurementUnit.name.value(),
      abbreviation: measurementUnit.abbreviation.value(),
      active: measurementUnit.active.value(),
    };

    const exists = await this.prisma.client.ctl_measurement_unit.findUnique({
      where: { id: data.id },
    });

    if (exists) {
      await this.prisma.client.ctl_measurement_unit.update({
        where: { id: data.id },
        data: {
          name: data.name,
          abbreviation: data.abbreviation,
          active: data.active,
          updated_at: new Date(),
        },
      });
    } else {
      await this.prisma.client.ctl_measurement_unit.create({
        data: {
          ...data,
          created_at: new Date(),
          updated_at: new Date(),
        },
      });
    }
  }

  async findById(id: MeasurementUnitId): Promise<MeasurementUnit | null> {
    const raw = await this.prisma.client.ctl_measurement_unit.findUnique({
      where: { id: id.value(), deleted_at: null },
    });

    if (!raw) return null;

    return new MeasurementUnit(
      new MeasurementUnitId(raw.id),
      new MeasurementUnitName(raw.name),
      new MeasurementUnitAbbreviation(raw.abbreviation),
      new MeasurementUnitActive(raw.active),
    );
  }

  async delete(id: MeasurementUnitId): Promise<void> {
    await this.prisma.client.ctl_measurement_unit.update({
      where: { id: id.value() },
      data: {
        active: false,
        deleted_at: new Date(),
      },
    });
  }
}
