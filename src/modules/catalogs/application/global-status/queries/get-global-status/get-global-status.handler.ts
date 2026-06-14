import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetGlobalStatusQuery } from './get-global-status.query';
import { GlobalStatusId } from '@/modules/catalogs/domain/value-objects/goblal-status-value-object/global-status-id';
import { NotFoundException } from '@/shared/domain/exceptions/not-found.exception';
import { GlobalStatusQueriesRepository } from '../../../repositories/global-status-read.repository';
import { GlobalStatusDto } from '../../../dtos/global-status.dto';

@QueryHandler(GetGlobalStatusQuery)
export class GetGlobalStatusHandler implements IQueryHandler<GetGlobalStatusQuery> {
  constructor(private readonly repository: GlobalStatusQueriesRepository) {}

  async execute(query: GetGlobalStatusQuery): Promise<GlobalStatusDto | null> {
    const globalStatusId = new GlobalStatusId(query.id_global_status);
    const globalStatus = await this.repository.getOneById(
      globalStatusId.value(),
    );
    if (!globalStatus) {
      throw new NotFoundException(
        'GlobalStatus',
        query.id_global_status.toString(),
      );
    }
    return globalStatus;
  }
}
