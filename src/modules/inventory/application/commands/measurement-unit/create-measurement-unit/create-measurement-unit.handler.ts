import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateMeasurementUnitCommand } from './create-measurement-unit.command';
import { MeasurementUnitRepository } from '../../../../domain/repositories/measurement-unit-repository';
import { MeasurementUnit } from '../../../../domain/entities/measurement-unit';
import { MeasurementUnitName } from '../../../../domain/value-objects/measurement-unit-value-object/measurement-unit-name';
import { MeasurementUnitAbbreviation } from '../../../../domain/value-objects/measurement-unit-value-object/measurement-unit-abbreviation';

@CommandHandler(CreateMeasurementUnitCommand)
export class CreateMeasurementUnitHandler
  implements ICommandHandler<CreateMeasurementUnitCommand>
{
  constructor(
    private readonly measurementUnitRepository: MeasurementUnitRepository,
  ) {}

  async execute(command: CreateMeasurementUnitCommand): Promise<void> {
    const { name, abbreviation } = command;

    const measurementUnit = MeasurementUnit.create(
      new MeasurementUnitName(name),
      new MeasurementUnitAbbreviation(abbreviation),
    );

    await this.measurementUnitRepository.save(measurementUnit);
  }
}
