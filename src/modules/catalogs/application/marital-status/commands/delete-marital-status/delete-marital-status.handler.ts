import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { MaritalStatusRepository } from '@/modules/catalogs/domain/repositories/marital-status-repository';
import { DeleteMaritalStatusCommand } from './delete-marital-status.command';
import { MaritalStatusId } from '@/modules/catalogs/domain/value-objects/marital-status-value-object/marital-status-id';
import { NotFoundException } from '@/shared/domain/exceptions/not-found.exception';
import { MaritalStatusQueriesRepository } from '../../../repositories/marital-status-read.repository';

@CommandHandler(DeleteMaritalStatusCommand)
export class DeleteMaritalStatusHandler implements ICommandHandler<DeleteMaritalStatusCommand> {
  constructor(
    private readonly repository: MaritalStatusRepository,
    private readonly readRepository: MaritalStatusQueriesRepository,
  ) {}
  async execute(command: DeleteMaritalStatusCommand): Promise<void> {
    const maritalStatus = await this.readRepository.getOneById(command.id);
    if (!maritalStatus) {
      throw new NotFoundException('MaritalStatus', command.id.toString());
    }
    const maritalStatusId = maritalStatus.id;
    if (!maritalStatusId) {
      throw new Error(`MaritalStatus id is undefined`);
    }

    await this.repository.delete(new MaritalStatusId(maritalStatusId));
  }
}
