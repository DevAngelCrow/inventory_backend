import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { CreateMaintenanceCommand } from './create-maintenance.command';
import { Maintenance } from '../../../../domain/entities/maintenance';
import { MAINTENANCE_REPOSITORY, MaintenanceRepository } from '../../../../domain/repositories/maintenance.repository';

@CommandHandler(CreateMaintenanceCommand)
export class CreateMaintenanceHandler implements ICommandHandler<CreateMaintenanceCommand> {
  constructor(
    @Inject(MAINTENANCE_REPOSITORY)
    private readonly repository: MaintenanceRepository,
  ) {}

  async execute(command: CreateMaintenanceCommand): Promise<Maintenance> {
    const maintenance = Maintenance.create(
      command.description,
      command.cost,
      command.quantity,
      command.date_start,
      command.date_end,
      command.id_product,
    );
    return this.repository.save(maintenance);
  }
}
