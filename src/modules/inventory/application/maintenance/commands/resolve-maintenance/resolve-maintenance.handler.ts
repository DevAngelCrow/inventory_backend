import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { ResolveMaintenanceCommand } from './resolve-maintenance.command';
import { Maintenance } from '../../../../domain/entities/maintenance';
import { MAINTENANCE_REPOSITORY, MaintenanceRepository } from '../../../../domain/repositories/maintenance.repository';
import { NotFoundException } from '@/shared/domain/exceptions/not-found.exception';

@CommandHandler(ResolveMaintenanceCommand)
export class ResolveMaintenanceHandler implements ICommandHandler<ResolveMaintenanceCommand> {
  constructor(
    @Inject(MAINTENANCE_REPOSITORY)
    private readonly repository: MaintenanceRepository,
  ) {}

  async execute(command: ResolveMaintenanceCommand): Promise<Maintenance> {
    const maintenance = await this.repository.findById(command.id);
    if (!maintenance) {
      throw new NotFoundException('Maintenance', command.id);
    }
    maintenance.resolve(command.date_end, command.cost);
    return this.repository.save(maintenance);
  }
}
