import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { MaritalStatusRepository } from '@/modules/catalogs/domain/repositories/marital-status-repository';
import { CreateMaritalStatusCommand } from './create-marital-status.command';
import { MaritalStatus } from '@/modules/catalogs/domain/entities/marital-status';

@CommandHandler(CreateMaritalStatusCommand)
export class CreateMaritalStatusHandler implements ICommandHandler<CreateMaritalStatusCommand> {
  constructor(private readonly repository: MaritalStatusRepository) {}

  async execute(command: CreateMaritalStatusCommand): Promise<void> {
    const maritalStatus = MaritalStatus.create({
      ...command.marital_status_dto,
    });
    await this.repository.create(maritalStatus);
  }
}
