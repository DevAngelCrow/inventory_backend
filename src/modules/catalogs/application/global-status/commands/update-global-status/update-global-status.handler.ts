import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { GlobalStatus } from '@/modules/catalogs/domain/entities/global-status';
import { UpdateGlobalStatusCommand } from './update-global-status.command';
import { GlobalStatsusRepository } from '@/modules/catalogs/domain/repositories/global-status-repository';
import { NotFoundException } from '@/shared/domain/exceptions/not-found.exception';
import { GlobalStatusQueriesRepository } from '../../../repositories/global-status-read.repository';

@CommandHandler(UpdateGlobalStatusCommand)
export class UpdateGlobalStatusHandler implements ICommandHandler<UpdateGlobalStatusCommand> {
  constructor(
    private readonly repository: GlobalStatsusRepository,
    private readonly readRepository: GlobalStatusQueriesRepository,
  ) {}
  async execute(command: UpdateGlobalStatusCommand): Promise<void> {
    const globalStatus = GlobalStatus.create({ ...command.global_status_dto });
    const globalStatusId = globalStatus.getId();
    if (!globalStatusId) {
      throw new Error(`GlobalStatus id is undefined`);
    }
    const foundGlobalStatus = await this.readRepository.getOneById(
      globalStatusId.value(),
    );
    if (!foundGlobalStatus) {
      throw new NotFoundException(
        'GlobalStatus',
        globalStatusId.value().toString(),
      );
    }
    await this.repository.update(globalStatus);
  }
}
