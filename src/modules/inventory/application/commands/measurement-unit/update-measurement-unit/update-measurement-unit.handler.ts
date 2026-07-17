import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateMeasurementUnitCommand } from './update-measurement-unit.command';
import { MeasurementUnitRepository } from '../../../../domain/repositories/measurement-unit-repository';
import { MeasurementUnitId } from '../../../../domain/value-objects/measurement-unit-value-object/measurement-unit-id';
import { MeasurementUnitName } from '../../../../domain/value-objects/measurement-unit-value-object/measurement-unit-name';
import { MeasurementUnitAbbreviation } from '../../../../domain/value-objects/measurement-unit-value-object/measurement-unit-abbreviation';
import { MeasurementUnitActive } from '../../../../domain/value-objects/measurement-unit-value-object/measurement-unit-active';
import { NotFoundException } from '@/shared/domain/exceptions/not-found.exception';

@CommandHandler(UpdateMeasurementUnitCommand)
export class UpdateMeasurementUnitHandler
  implements ICommandHandler<UpdateMeasurementUnitCommand>
{
  constructor(
    private readonly measurementUnitRepository: MeasurementUnitRepository,
  ) {}

  async execute(command: UpdateMeasurementUnitCommand): Promise<void> {
    const { id, name, abbreviation, active } = command;

    const measurementUnitId = new MeasurementUnitId(id);
    const measurementUnit = await this.measurementUnitRepository.findById(
      measurementUnitId,
    );

    if (!measurementUnit) {
      throw new NotFoundException('MeasurementUnit', command.id);
    }

    measurementUnit.update(
      new MeasurementUnitName(name),
      new MeasurementUnitAbbreviation(abbreviation),
      new MeasurementUnitActive(active),
    );

    await this.measurementUnitRepository.save(measurementUnit);
  }
}
