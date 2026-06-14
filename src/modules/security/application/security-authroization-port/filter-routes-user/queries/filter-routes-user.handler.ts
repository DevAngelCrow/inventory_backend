import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { SecurityAuthorizationPort } from '@/modules/security/domain/ports/security-authorization.port';
import { FilterRoutesUserQuery } from './filter-routes-user.query';
import { Menu } from '@/modules/security/domain/entities/menu';

@QueryHandler(FilterRoutesUserQuery)
export class FilterRoutesUserHandler<
  T,
> implements IQueryHandler<FilterRoutesUserQuery> {
  constructor(
    private readonly securityAuthorizationPort: SecurityAuthorizationPort,
  ) {}
  async execute(query: FilterRoutesUserQuery): Promise<Menu<T>[]> {
    return await this.securityAuthorizationPort.filterRoutesForUser<T>(
      query.id_user,
    );
  }
}
