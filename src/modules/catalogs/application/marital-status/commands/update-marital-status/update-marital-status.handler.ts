import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { MaritalStatus } from '@/modules/catalogs/domain/entities/marital-status';
import { UpdateMaritalStatusCommand } from './update-marital-status.command';
import { MaritalStatusRepository } from '@/modules/catalogs/domain/repositories/marital-status-repository';
import { NotFoundException } from '@/shared/domain/exceptions/not-found.exception';
import { MaritalStatusQueriesRepository } from '../../../repositories/marital-status-read.repository';

@CommandHandler(UpdateMaritalStatusCommand)
export class UpdateMaritalStatusHandler implements ICommandHandler<UpdateMaritalStatusCommand> {
  constructor(
    private readonly repository: MaritalStatusRepository,
    private readonly readRepository: MaritalStatusQueriesRepository,
  ) {}
  async execute(command: UpdateMaritalStatusCommand): Promise<void> {
    const maritalStatus = MaritalStatus.create({
      ...command.marital_status_dto,
    });
    const maritalStatusId = maritalStatus.getId();
    if (!maritalStatusId) {
      throw new Error(`MaritalStatus id is undefined`);
    }
    const foundMaritalStatus = await this.readRepository.getOneById(
      maritalStatusId.value(),
    );
    if (!foundMaritalStatus) {
      throw new NotFoundException(
        'MaritalStatus',
        maritalStatusId.value().toString(),
      );
    }
    await this.repository.update(maritalStatus);
  }
}
