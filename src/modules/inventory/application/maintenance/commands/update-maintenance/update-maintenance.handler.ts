import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { UpdateMaintenanceCommand } from './update-maintenance.command';
import { Maintenance } from '../../../../domain/entities/maintenance';
import {
  MAINTENANCE_REPOSITORY,
  MaintenanceRepository,
} from '../../../../domain/repositories/maintenance.repository';
import { NotFoundException } from '@/shared/domain/exceptions/not-found.exception';

@CommandHandler(UpdateMaintenanceCommand)
export class UpdateMaintenanceHandler implements ICommandHandler<UpdateMaintenanceCommand> {
  constructor(
    @Inject(MAINTENANCE_REPOSITORY)
    private readonly repository: MaintenanceRepository,
  ) {}

  async execute(command: UpdateMaintenanceCommand): Promise<Maintenance> {
    const maintenance = await this.repository.findById(command.id);
    if (!maintenance) {
      throw new NotFoundException('Maintenance', command.id);
    }
    maintenance.update(
      command.description,
      command.quantity,
      command.date_start,
      command.id_product,
      command.cost,
    );
    return this.repository.save(maintenance);
  }
}
