import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { GlobalStatsusRepository } from '@/modules/catalogs/domain/repositories/global-status-repository';
import { DeleteGlobalStatusCommand } from './delete-global-status.command';
import { GlobalStatusId } from '@/modules/catalogs/domain/value-objects/goblal-status-value-object/global-status-id';
import { NotFoundException } from '@/shared/domain/exceptions/not-found.exception';
import { GlobalStatusQueriesRepository } from '../../../repositories/global-status-read.repository';
import { GlobalStatusDto } from '../../../dtos/global-status.dto';

@CommandHandler(DeleteGlobalStatusCommand)
export class DeleteGlobalStatusHandler implements ICommandHandler<DeleteGlobalStatusCommand> {
  constructor(
    private readonly repository: GlobalStatsusRepository,
    private readonly readRepository: GlobalStatusQueriesRepository,
  ) {}
  async execute(command: DeleteGlobalStatusCommand): Promise<GlobalStatusDto> {
    const globalStatus = await this.readRepository.getOneById(command.id);
    if (!globalStatus) {
      throw new NotFoundException('GlobalStatus', command.id.toString());
    }
    const globalStatusId = globalStatus.id;
    if (!globalStatusId) {
      throw new Error(`GlobalStatus id is undefined`);
    }
    const globalStatusEntity = await this.repository.toggleStatus(
      new GlobalStatusId(globalStatusId),
    );

    const globalStatusDto = GlobalStatusDto.fromEntity(globalStatusEntity);

    return globalStatusDto;
  }
}
