import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { AuthReadPort, SessionDto } from '../../ports/auth-read.port';
import { GetSessionsQuery } from './get-sessions.query';

@QueryHandler(GetSessionsQuery)
export class GetSessionsHandler implements IQueryHandler<GetSessionsQuery> {
  constructor(private readonly authReadPort: AuthReadPort) {}

  async execute(query: GetSessionsQuery): Promise<SessionDto[]> {
    return this.authReadPort.getSessionsByUser(query.userId);
  }
}
