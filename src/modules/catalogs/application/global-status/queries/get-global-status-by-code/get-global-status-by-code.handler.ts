import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { NotFoundException } from '@/shared/domain/exceptions/not-found.exception';
import { GlobalStatusQueriesRepository } from '../../../repositories/global-status-read.repository';
import { GlobalStatusDto } from '../../../dtos/global-status.dto';
import { GetGlobalStatusByCodeQuery } from './get-global-status-by-code.query';

@QueryHandler(GetGlobalStatusByCodeQuery)
export class GetGlobalStatusByCodeHandler implements IQueryHandler<GetGlobalStatusByCodeQuery> {
  constructor(private readonly repository: GlobalStatusQueriesRepository) {}

  async execute(
    query: GetGlobalStatusByCodeQuery,
  ): Promise<GlobalStatusDto | null> {
    const globalStatusCode = query.code;
    const category = query.category_name;
    const globalStatus = await this.repository.getOneByCode(
      globalStatusCode,
      category,
    );
    if (!globalStatus) {
      throw new NotFoundException(
        'GlobalStatus',
        `No se encontró un estado global con el código ${globalStatusCode} en la categoría ${category}`,
      );
    }
    return globalStatus;
  }
}
