import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteMeasurementUnitCommand } from './delete-measurement-unit.command';
import { MeasurementUnitRepository } from '../../../../domain/repositories/measurement-unit-repository';
import { MeasurementUnitId } from '../../../../domain/value-objects/measurement-unit-value-object/measurement-unit-id';
import { NotFoundException } from '@/shared/domain/exceptions/not-found.exception';

@CommandHandler(DeleteMeasurementUnitCommand)
export class DeleteMeasurementUnitHandler
  implements ICommandHandler<DeleteMeasurementUnitCommand>
{
  constructor(
    private readonly measurementUnitRepository: MeasurementUnitRepository,
  ) {}

  async execute(command: DeleteMeasurementUnitCommand): Promise<void> {
    const { id } = command;

    const measurementUnitId = new MeasurementUnitId(id);
    const measurementUnit = await this.measurementUnitRepository.findById(
      measurementUnitId,
    );

    if (!measurementUnit) {
      throw new NotFoundException(
        'Measurement Unit',
        id,
      );
    }

    await this.measurementUnitRepository.delete(measurementUnitId);
  }
}
